import jwt from 'jsonwebtoken'
import { IUserToken } from '../types/user'
import { SECRET } from './env'

const signIn = (user: IUserToken) => {
    const token = jwt.sign(user, SECRET, {
        expiresIn: "1h"
    });
    return token;
}

const getUserByToken = (token: string) => {
    const result = jwt.verify(token, SECRET) as IUserToken;
    return result;
}

export {signIn, getUserByToken}