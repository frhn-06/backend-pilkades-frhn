import jwt from 'jsonwebtoken'
import { IUserResetPassword, IUserToken } from '../types/user'
import { RESET_PASSWORD_RESET, SECRET } from './env'

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


const createTokenReset = (obj: IUserResetPassword) => {
    const token = jwt.sign(obj, RESET_PASSWORD_RESET, {
        expiresIn: "1h"
    });
    return token
}

const verifyTokenReset = (token: string) => {
    const result = jwt.verify(token, RESET_PASSWORD_RESET) as IUserResetPassword;
    return result;
}

export {signIn, getUserByToken, createTokenReset, verifyTokenReset}