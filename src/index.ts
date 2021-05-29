import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import redis from 'redis'
import express from 'express'
import passport from 'passport'

import { config } from './config'
import { serialize, deserialize, createSession} from './passport/passport.controller'

import './database'
import verify from './verifyToken'
import secureRoute from './secure.routes'
import googleRoutes from './passport/strategy/google/google.strategy'
import twitterRoutes from './passport/strategy/twitter/twitter.strategy'
import localRoutes from './passport/strategy/local/local.strategy'

const app = express()

//Site that allow to verb action in API
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

const redisClient = redis.createClient({
    port: 4000,
    host : 'http://localhost:3000'
})
redisClient.on('connect', ()=>{
    console.log('connected')
})
const limiter = require('express-limiter')(app, redisClient)

//Limit requests to 100 per hour per ip address
limiter({
    lookup: ['connection.remoteAddress'],
    total: 100,
    expire: 1000 * 60 * 60
})

//Add 11 layer of security
app.use(helmet())

//Console verb action in HTTP
app.use(morgan('dev'))
app.use(express.json())

//ALlow test in localhost:4000
app.set("trust proxy", 1)

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