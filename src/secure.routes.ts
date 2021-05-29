const express = require('express');
const router = express.Router();
import { RequestHandler } from 'express'
import User from './user'
import { IUserSession } from './types'

const getProfile: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user as IUserSession
        console.log(user.SESSION)
        res.send(req.user)
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', getProfile);

export default router;