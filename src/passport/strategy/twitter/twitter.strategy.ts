import User from '../../../user'
import passport from 'passport'
import passportTwitter from 'passport-twitter'

import { config } from '../../../config'
import { IMongoUser } from '../../../index.interfaces'

const TwitterStrategy = passportTwitter.Strategy

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