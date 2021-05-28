import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import passportTwitter from 'passport-twitter'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { config } from './config'
import './database'
import User from './user'
import { IMongoUser, verifiedUser } from './types'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import verify from './verifyToken'

const TwitterStrategy = passportTwitter.Strategy
const GoogleStrategy = passportGoogle.Strategy
const LocalStrategy = passportLocal.Strategy
const app = express()

//Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.set("trust proxy", 1)
app.use(
    session({
        secret: 'secretcode',
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 //One week
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())

//Taking user data from authentication and store it in session cookie
passport.serializeUser((user: IMongoUser, done: any) => {
    return done(null, user._id)
})

//Take user data and attaching it to req.user
passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (err: Error, user: IMongoUser) => {
        const userData = {
            username: user.username,
            id: user._id
        }
        return done(null, userData)
    })
})

//Local Passport
passport.use(new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: IMongoUser) => {
        if (err) throw err
        if (!user) return done(null, false, { message: "No user with that username!" })
        bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err
            if (result === true) { return done(null, user) }
            else { return done(null, false, { message: "Incorrect password!" }) }
        });
    });
})
);

//Google Passport
passport.use(new GoogleStrategy({
    clientID: `${config.GOOGLE_CLIENT_ID}`,
    clientSecret: `${config.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
},
    function (_: any, __: any, profile: any, cb: any) {
        try {
            User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoUser) => {
                if (err) return cb(err, null)
                if (!doc) {
                    const newUser = new User({
                        googleId: profile.id,
                        username: profile.name.givenName
                    })
                    await newUser.save()
                    cb(null, newUser)
                }
                cb(null, doc)
            })
        } catch (error) { console.log(error) }
    }
))

//Twitter Passport
passport.use(new TwitterStrategy({
    consumerKey: `${config.TWITTER_CONSUMER_KEY}`,
    consumerSecret: `${config.TWITTER_CONSUMER_SECRET}`,
    callbackURL: "/auth/twitter/callback"
},
    function (_: any, __: any, profile: any, cb: any) {
        try {
            User.findOne({ twitterId: profile.id }, async (err: Error, doc: IMongoUser) => {
                if (err) return cb(err, null)
                if (!doc) {
                    const newUser = new User({
                        twitterId: profile.id,
                        username: profile.username
                    })
                    await newUser.save()
                    cb(null, newUser)
                }
                cb(null, doc)
            })
        } catch (error) { console.log(error) }
    }
))

//Routes
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err)
        if (info) return res.send(info)
        if (!user) return res.send("Something went wrong!")
        req.logIn(user, (err) => {
            if (err) return next(err)
            //Create and assign token
            const token = jwt.sign({ _id: user._id }, `${config.TOKEN_SECRET}`)
            res.header('auth-token', token).send(token)
        })
    })(req, res, next)
})

app.post('/register', async (req, res) => {
    const { username, password } = req?.body;
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.send("Improper Values");
        return;
    }
    User.findOne({ username }, async (err: Error, doc: IMongoUser) => {
        if (err) throw err;
        if (doc) res.send("User already exists!");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send("Success account creation!")
        }
    })
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000');
    }
)

app.get('/auth/twitter', passport.authenticate('twitter'))

qpp.get('/getUser/socmedway', (req, res) => {
    res.send(req.user)
})

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000');
    }
)

app.get('/getUser', verify, async (req, res) => {
    const user = req.user
    const userId = user as verifiedUser
    const userFound = await User.findById({ _id: userId._id })
    if (!userFound) res.status(301).send('Something went wrong!')
    res.send(userFound)
})

app.get('/auth/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send("Successfully logout!")
    }
})

app.listen(config.PORT || 4000, () => { console.log('Server is up!') })