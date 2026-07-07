import { NextFunction, Request, Response } from "express"
import response from "../utils/response";
import { getUserByToken } from "../utils/jwt";
import { IReqUser } from "../types/user";


const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authorize = req.headers.authorization;
        if(!authorize) return response.unauthorize(res);
        
        const [bearer, token] = authorize.split(" ");
        if(bearer !== "Bearer" || !token) return response.unauthorize(res);
    
        const user = getUserByToken(token);
    
        (req as unknown as IReqUser).user = user;
    
        next();
    } catch(error) {
        next(error);
    }
}



export default authMiddleware;