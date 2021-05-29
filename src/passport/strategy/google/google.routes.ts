import jwt from 'jsonwebtoken'
import passport from 'passport'

import { Router } from 'express'
import {config} from '../../../config'
import {verifiedUser} from '../../../index.interfaces'

const router = Router()

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'], session: true })
)

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', session: true }),
    function (req, res) {
        const user = req.user
        const userId = user as verifiedUser
        // Successful authentication, redirect home.
        const token = jwt.sign({ SESSION: userId._id }, `${config.TOKEN_SECRET}`)
        res.redirect(`http://localhost:3000/socmed/session/${token}`)
    }
)

export default router