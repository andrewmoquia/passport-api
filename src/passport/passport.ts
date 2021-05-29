import User from '../user'
import { IMongoUser} from '../index.interfaces'
import passport from 'passport'

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