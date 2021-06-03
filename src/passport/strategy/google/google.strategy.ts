import User from '../../../user'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'

import { config } from '../../../config'
import { Router } from 'express'
import { IMongoUser, verifiedUser } from '../../../index.interfaces'

const GoogleStrategy = passportGoogle.Strategy
const router = Router()

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

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'], session: true })
)

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000', session: true }),
    function (req, res) {
        const user = req.user
        const userId = user as verifiedUser
        // Successful authentication, redirect home.
        const token = jwt.sign({ SESSION: userId._id }, `${config.TOKEN_SECRET}`)
        res.redirect(`http://localhost:3000/auth/${token}`)
    }
)

export default router