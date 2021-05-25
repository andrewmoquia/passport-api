import { Schema, model } from 'mongoose'

const User = new Schema({
    googleId: { type: String, required: false },
    twitterId: { type: String, required: false },
    username: { type: String, required: true }
})

export default model('User', User)