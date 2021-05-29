const express = require('express');
const router = express.Router();
import {RequestHandler} from 'express'

const getProfile: RequestHandler = (req, res, next) => {
    res.send({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
}

router.get('/profile', getProfile);

export default router;