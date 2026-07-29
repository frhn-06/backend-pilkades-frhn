import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";
import { generateTokenVote } from "../utils/tokenvote";
import { generateExpired } from "../utils/tokenexpired";

const tokenVoteController = {
    create: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {voterId} = req.params;
            if(!voterId) return response.notFound(res, "Voter tidak ditemukan");

            const tokenIsUsed = await prisma.tokenVote.findFirst({
                where: {
                    electionId: electionId,
                    tpsId: tpsId,
                    voterId: Number(voterId),
                    isUsed: true
                }
            });

           if(tokenIsUsed) return response.error(res, false, "Voter sudah mencoblos");

            const tokenIsActive = await prisma.tokenVote.findFirst({
                where: {
                    electionId: electionId,
                    tpsId: tpsId,
                    voterId: Number(voterId),
                    isUsed: false,
                    expiredAt: {
                        gt: new Date()
                    }
                }
            })
            
            if(tokenIsActive) return response.error(res, false, "Voter masih memiliki token aktif");

            const token = generateTokenVote();

            const now = new Date();
            const selisih = 1000 * 60 * 60 * 4;
            const expiredAt = generateExpired(now, selisih);

            const result = await prisma.tokenVote.create({
                data: {
                    token: token,
                    expiredAt: expiredAt,
                    electionId: electionId,
                    tpsId: tpsId,
                    voterId: Number(voterId),
                }
            })
            
            response.success(res, result, "Berhasil menggenerate token")
        } catch (error) {
            response.error(res, error, "Gagal menggenerate token");
        }
    },

    findAll: async (req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);
            
            const result = await prisma.tokenVote.findMany({
                where: {
                    electionId: electionId,
                    tpsId: tpsId
                }
            })

            response.success(res, result, "Berhasil mengakses semua token");
        } catch(error) {
            response.error(res, error, "Gagal mengakses semua token");
        }
    },


    validation: async (req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {token} = req.body as {token: string};
            
            const tokenAda = await prisma.tokenVote.findUnique({
                where: {
                    electionId_token: {
                        electionId: electionId,
                        token: token
                    }
                }
            });

            if(!tokenAda) return response.notFound(res, "Token tidak ditemukan")

            
            if(tokenAda.isUsed) return response.error(res, {status: "error"}, "Token sudah digunakan");

            const now = new Date().getTime();
            const expired = tokenAda.expiredAt.getTime();
            if(tokenAda && !tokenAda.isUsed && now > expired) return response.error(res, {status: "error"}, "Token sudah kadalwarsa");

            response.success(res, {status: "success", voterId: tokenAda.voterId}, "Validasi token berhasil")

        }catch(error) {
            response.error(res, error, "Validasi token gagal");
        }
    }
}


export default tokenVoteController;