import { Schema, model } from 'mongoose'

const User = new Schema({
    googleId: { type: String, required: false },
    twitterId: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: false }
})

export default model('User', User)