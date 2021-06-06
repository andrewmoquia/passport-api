import express from 'express'
import { RequestHandler } from 'express'
import User from './user'
import { IUserSession } from './index.interfaces'

const router = express.Router();

const getProfile: RequestHandler = async (req, res) => {
    try {
        const user = req.user as IUserSession
        const userFound = await User.findById({_id: user.id}, async (err, user) => {
            if(err) res.status(301).send('Something went wrong!')
            const sentUserData = {
                id: userFound._id, 
                username: userFound.username,
                accountType: userFound.accountType
            }
            res.send(sentUserData)
        })
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', getProfile);

export default router;