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

export interface verifiedUser {
    _id: string,
    iat: string
}

export interface IUserSession {
    id:any,
    iat: number
}