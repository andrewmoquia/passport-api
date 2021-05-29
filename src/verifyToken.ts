import jwt from 'jsonwebtoken'
import { config } from './config'

export default function auth(req: any, res: any, next: any) {
    const token = req.header('auth_token')
    if (!token) res.status(401).send('Access Denied!')
    try {
        const verified = jwt.verify(token, `${config.TOKEN_SECRET}`)
        req.user = verified
        next()
    } catch (error) {
        res.status(401).send('Invalid Token!')
    }
}