import User from '../../../user'
import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'

import { config } from '../../../config'
import {IMongoUser} from '../../../index.interfaces'

const GoogleStrategy = passportGoogle.Strategy


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