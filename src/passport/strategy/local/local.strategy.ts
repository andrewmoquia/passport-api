import User from '../../../user'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import passportLocal from 'passport-local'

import { IMongoUser } from '../../../index.interfaces'

const LocalStrategy = passportLocal.Strategy

//Local Passport
passport.use(new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: IMongoUser) => {
        if (err) throw err
        if (!user) return done(null, false, { message: "No user with that username!" })
        bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err
            if (result === true) { return done(null, user) }
            else { return done(null, false, { message: "Incorrect password!" }) }
        })
    })
})
)