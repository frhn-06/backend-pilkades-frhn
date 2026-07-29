import { IReqUser } from "../types/user"
import { NextFunction, Response } from "express"
import prisma from "../libs/prisma"
import response from "../utils/response"
import { ElectionStatus } from "@prisma/client"


const electionStatusMiddleware = (status: ElectionStatus[]) => {
    return async (req:IReqUser, res:Response, next: NextFunction) => {
        // const electionId = req.user!.electionId;
        // if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan/ belum dibuat")

        // const election = await prisma.election.findUnique({
        //     where: {
        //         id: electionId
        //     }
        // })

        // if(!election) return response.notFound(res, "Eleksi tidak ditemukan");

        // if(!status.includes(election?.status)) return response.error(res, false, "Election belum memasuki tahap yang mengizinkan aksi ini.");

        next();
    }
}

export default electionStatusMiddleware;