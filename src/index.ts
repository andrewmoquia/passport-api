import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import express from 'express'
import passport from 'passport'
import rateLimit from 'express-rate-limit'

import { config } from './config'
import { serialize, deserialize, createSession} from './passport/passport.controller'

import './database'
import verify from './verifyToken'
import secureRoute from './secure.routes'
import googleRoutes from './passport/strategy/google/google.strategy'
import twitterRoutes from './passport/strategy/twitter/twitter.strategy'
import localRoutes from './passport/strategy/local/local.strategy'

const app = express()

//Add limit to all request base on this condition
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 200 requests per windowMs
});

//ALlow test in localhost:3000
app.set("trust proxy", 1)

//Site that allow to make request in API
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

//Add 11 layer of security
app.use(helmet())

//Apply the limiter
app.use(limiter)

//Console request action in HTTP
app.use(morgan('dev'))
app.use(express.json())

//Create cookie when interacting with API
app.use(createSession)

//Start passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Taking user data from authentication and store it in session cookie
passport.serializeUser(serialize)

//Take user data and attaching it to req.user
passport.deserializeUser(deserialize)

//Hadle login routes verb action
app.use(googleRoutes)
app.use(twitterRoutes)
app.use(localRoutes)

//Authenticate request in secure routes
app.use('/user', verify, secureRoute)

app.listen(config.PORT || 4000, () => { console.log('Server is up!') })