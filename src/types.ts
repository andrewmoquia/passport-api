export interface IUser {
    _id: string,
    googleId?: string,
    twitterId?: string,
    username: string
}

export interface IMongoUser {
    _id: string,
    googleId?: string,
    twitterId?: string,
    username: string,
    password: string,
    _v: number
}