import zod from "zod";
import { registerDTO } from "../validations/user.validation";
import { User, UserRole } from "@prisma/client";
import { Request } from "express";

interface IUser extends User {

}

interface IUserToken extends Omit<IUser, "name" | "email" | "password" | "isActive" | "activationCode" | "createdAt" | "updatedAt"> {
    id: number;
}

interface IReqUser extends Request {
    user?: IUserToken
}

export type {IUser, IUserToken, IReqUser}