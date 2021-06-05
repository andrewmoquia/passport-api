import User from '../../../user'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import passportLocal from 'passport-local'


import { Router } from 'express'
import { config } from '../../../config'

import { IMongoUser } from '../../../index.interfaces'

const LocalStrategy = passportLocal.Strategy
const router = Router()

//Local Passport
passport.use(new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: IMongoUser) => {
        if (err) throw err
        if (!user) return done(null, false, { message: "Invalid username or password!" })
        bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err
            if (result === true) { return done(null, user) }
            else { return done(null, false, { message: "Invalid username or password!" }) }
        })
    })
})
)

//Routes
router.post('/login',  (req, res, next) => {
    passport.authenticate('local',  (err, user, info) => {
        if (err) return next(err)
        if (info) return res.send(info)
        if (!user) return res.send({message: "Something went wrong!"})
        if(user.accoutType === req.body.accountType) {
            req.logIn(user, { session: false }, async (err) => {
            if (err) return next(err)
            //Create and assign token
            const createdToken = jwt.sign({ SESSION: user._id }, `${config.TOKEN_SECRET}`)
            res.header('auth_token', createdToken).send({token: createdToken})
             })
        } else {
            res.send({message: 'Account not authorized!'})
        }
        
    })(req, res, next)
})

router.post('/register', async (req, res) => {
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
})

router.get('/auth/logout', (req, res) => {
    req.logout()
    res.send("Successfully logout!")
})

export default router