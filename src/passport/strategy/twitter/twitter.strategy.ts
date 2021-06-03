import User from '../../../user'
import passport from 'passport'
import passportTwitter from 'passport-twitter'
import jwt from 'jsonwebtoken'

import { config } from '../../../config'
import { IMongoUser, verifiedUser } from '../../../index.interfaces'
import { Router } from 'express'

const TwitterStrategy = passportTwitter.Strategy
const router = Router()

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

router.get('/auth/twitter', passport.authenticate('twitter', { session: true }))

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000', session: true }),
    function (req, res) {
        const user = req.user
        const userId = user as verifiedUser
        // Successful authentication, redirect home.
        const token = jwt.sign({ SESSION: userId._id }, `${config.TOKEN_SECRET}`)
        res.redirect(`http://localhost:3000/auth/${token}`)
    }
)

export default router