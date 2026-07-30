import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import { voteDTO } from "../validations/vote.validation";
import prisma from "../libs/prisma";

const voteController = {
    create: async(req:IReqUser, res: Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const validate = voteDTO.parse(req.body);

            const result = await prisma.$transaction(async(tx) => {
                const token = await tx.tokenVote.findUnique({
                    where: {
                        electionId_token: {
                            electionId: electionId,
                            token: validate.token
                        }
                    }
                });
                if(!token) throw new Error("Token vote tidak ditemukan");
                if(token.isUsed) throw new Error("Token vote tidak sudah digunakan");
                if(token.expiredAt.getTime() < new Date().getTime()) throw new Error("Token vote expired");
                if(token.tpsId !== tpsId) throw new Error("Tps tidak sesuai");

                const voter = await tx.voter.findUnique({
                    where: {
                        id: token.voterId,
                    }
                })
                if(!voter || voter.electionId !== electionId) throw new Error("Voter tidak ditemukan");;
                if(voter.isVoted) throw new Error("Voter sudah mencoblos");
                if(!voter.isPresent) throw new Error("Voter belum lahir / melakukan absendi");
                
                const candidate = await tx.candidate.findFirst({
                    where: {
                        id: validate.candidateId,
                        electionId: electionId
                    }
                })
                if(!candidate) throw new Error("Kandidat calon tidak ditemukan");

                const vote = await tx.vote.create({
                    data: {
                        candidateId: validate.candidateId,
                        voterId: token.voterId,
                        electionId: electionId,
                        tpsId: tpsId,
                    }
                });

                await tx.tokenVote.update({
                    where: {
                        id:token.id
                    },
                    data: {
                        isUsed: true,
                        usedAt: new Date()
                    }
                });

                await tx.voter.update({
                    where: {
                        id: token.voterId
                    }, 
                    data: {
                        isVoted: true
                    }
                })

                return vote;
            })

            response.success(res, result, "Berhasil melakukan voting")
        } catch(error) {
            response.error(res, error, "Gagal melakukan voting")
        }
    } 
}



export default voteController;