import { NextFunction, Response } from "express"
import { IReqUser } from "../types/user"
import response from "../utils/response";

const electionMiddleware = (req:IReqUser, res:Response, next: NextFunction) => {
    const electionId = req.user?.electionId;
    if(!electionId || electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");

    next();
}



export default electionMiddleware;