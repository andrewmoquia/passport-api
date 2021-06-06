import express from 'express'
import { RequestHandler } from 'express'
import User from './user'
import { IUserSession, IMongoUser } from './index.interfaces'

const router = express.Router();

const getProfile: RequestHandler = async (req, res) => {
    try {
        const user = req.user as IUserSession
        const userFound = await User.findById({_id: user.id}, (err: Error, user: IMongoUser) => {
            if(err) res.status(301).send('Something went wrong!')
            const userData = {
                id: user._id, 
                username: user.username,
                accountType: user.accountType
            }
            res.send(userData)
        })
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', getProfile);

export default router;