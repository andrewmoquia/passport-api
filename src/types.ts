export interface IUser {
    googleId?: string,
    twitterId?: string,
    username: string
}

export interface IMongoUser {
    _id: string,
    googleId?: string,
    twitterId?: string,
    username: string,
    _v: number
}