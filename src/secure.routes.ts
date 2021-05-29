const express = require('express');
const router = express.Router();
import { RequestHandler } from 'express'
import User from './user'
import { IUserSession } from './types'

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

router.get('/profile', getProfile);

export default router;