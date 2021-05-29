import dotenv from 'dotenv'

dotenv.config()

export const config = {
    DATABASE: process.env.DATABASE,
    PORT: process.env.PORT,
    DISABLE_XORIGIN: process.env.DISABLE_XORIGIN,
    XORIG_RESTRICT: process.env.XORIG_RESTRICT,
    ORIGIN_SITE: process.env.TEST_SITE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    TOKEN_SECRET: process.env.TOKEN_SECRET
}