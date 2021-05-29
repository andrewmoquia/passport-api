const express = require('express');
const router = express.Router();
import {RequestHandler} from 'express'

const getProfile: RequestHandler = (req, res, next) => {
    res.send(req.user)
}

router.get('/profile', getProfile);

export default router;