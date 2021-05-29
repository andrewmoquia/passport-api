import User from '../user'
import { IMongoUser} from '../index.interfaces'

export const serialize = (user: IMongoUser, done: any) => {
    return done(null, user._id)
}

export const deserialize = (id: string, done: any) => {
    User.findById(id, (err: Error, user: IMongoUser) => {
        const userData = {
            username: user.username,
            id: user._id
        }
        return done(null, userData)
    })
}

export const createSession = session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 //One week
    }
})