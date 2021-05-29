import jwt from 'jsonwebtoken'
import User from '../../../user'
import bcrypt from 'bcryptjs'
import passport from 'passport'

import { Router } from 'express'
import { config } from '../../../config'
import { IMongoUser } from '../../../index.interfaces'

const router = Router()

//Routes
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err)
        if (info) return res.send(info)
        if (!user) return res.send("Something went wrong!")
        req.logIn(user, { session: false }, async (err) => {
            if (err) return next(err)
            //Create and assign token
            const token = jwt.sign({ SESSION: user._id }, `${config.TOKEN_SECRET}`)
            res.header('auth_token', token).send(token)
        })
    })(req, res, next)
})

router.post('/register', async (req, res) => {
    const { username, password } = req?.body;
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.send("Improper Values");
        return;
    }
    User.findOne({ username }, async (err: Error, doc: IMongoUser) => {
        if (err) throw err;
        if (doc) res.send("User already exists!");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send("Success account creation!")
        }
    })
})

router.get('/auth/logout', (req, res) => {
    req.logout()
    res.send("Successfully logout!")
})

export default router