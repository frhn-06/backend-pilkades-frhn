import zod from "zod";
import { registerDTO } from "../validations/user.validation";
import { User, UserRole } from "@prisma/client";

interface IUser extends User {

}

interface IUserToken extends Omit<IUser, "name" | "email" | "password" | "isActive" | "activationCode" | "tpsId" | "createdAt" | "updatedAt"> {
    id: number;
}


export type {IUser, IUserToken}