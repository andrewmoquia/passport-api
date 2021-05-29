const express = require('express');
const router = express.Router();
import {RequestHandler} from 'express'
import User from './user'

const getProfile: RequestHandler = async (req, res, next) => {
    try {
        console.log(req.user)
        res.send(req.user)
    } catch (error) {
        console.log(error)
    }
}

router.get('/profile', getProfile);

export default router;