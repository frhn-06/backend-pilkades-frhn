import { NextFunction, Response } from "express"
import { IReqUser } from "../types/user"
import response from "../utils/response"
import { UserRole } from "@prisma/client"

const aclMiddleware = (array: UserRole[]) => {
    return (req:IReqUser, res:Response, next:NextFunction) => {
        const roleUser = req.user?.role;
        if(!roleUser) return response.unauthorize(res);

        const lolos = array.includes(roleUser);
        if(!lolos) return response.forbidden(res);

        next();
    }
}

export default aclMiddleware;