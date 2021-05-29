const express = require('express');
const router = express.Router();
import {RequestHandler} from 'express'
import User from './user'

const getProfile: RequestHandler = async (req, res, next) => {
    try {
        console.log(req.user)
        const userFound = await User.findById({_id: req.user.SESSION})
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', getProfile);

export default router;