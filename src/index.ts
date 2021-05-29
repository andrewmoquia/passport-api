import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'

import { config } from './config'
import './database'

// import User from './user'
// import { IMongoUser } from './index.interfaces'
import { serialize, deserialize, createSession} from './passport/passport.controller'

import morgan from 'morgan'
import verify from './verifyToken'
import secureRoute from './secure.routes'
import googleRoutes from './passport/strategy/google/google.strategy'
import twitterRoutes from './passport/strategy/twitter/twitter.strategy'
import localRoutes from './passport/strategy/local/local.strategy'

const app = express()

//Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.set("trust proxy", 1)
app.use(createSession)

app.use(passport.initialize())
app.use(passport.session())

//Taking user data from authentication and store it in session cookie
passport.serializeUser(serialize)

//Take user data and attaching it to req.user
passport.deserializeUser(deserialize)

app.use(googleRoutes)
app.use(twitterRoutes)
app.use(localRoutes)

app.use('/user', verify, secureRoute)

app.listen(config.PORT || 4000, () => { console.log('Server is up!') })