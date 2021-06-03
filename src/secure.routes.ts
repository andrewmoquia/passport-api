import express from 'express'
import { RequestHandler } from 'express'
import User from './user'
import cors from 'cors'
import { IUserSession } from './index.interfaces'

const router = express.Router();
const corsOptions = {
    methods: "OPTIONS",
    exposedHeaders: "false"
}


const getProfile: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user as IUserSession
        const userFound = await User.findById({_id: user.SESSION})
        if (!userFound) res.status(301).send('Something went wrong!')
        res.send(userFound)
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', cors(corsOptions), getProfile);

export default router;