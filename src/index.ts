import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'

import { config } from './config'
import './database'

import User from './user'
import { IMongoUser } from './index.interfaces'

import morgan from 'morgan'
import verify from './verifyToken'
import secureRoute from './secure.routes'
import googleRoutes from './passport/strategy/google/google.routes'
import twitterRoutes from './passport/strategy/twitter/twitter.routes'
import localRoutes from './passport/strategy/local/local.routes'

const app = express()

//Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.set("trust proxy", 1)
app.use(
    session({
        secret: 'secretcode',
        resave: false,
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

app.use(googleRoutes)
app.use(twitterRoutes)
app.use(localRoutes)

app.use('/user', verify, secureRoute)

app.listen(config.PORT || 4000, () => { console.log('Server is up!') })