import mongoose, { ConnectOptions } from 'mongoose'
import { config } from './config'

(async () => {
    try {
        const mongooseOption: ConnectOptions = {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
        const db = await mongoose.connect(`${config.DATABASE}`, mongooseOption)
        console.log(`Database '${db.connection.name}' is connected`)
    } catch (error) { console.log(error) }
})()