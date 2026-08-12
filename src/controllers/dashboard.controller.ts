import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";

const dashboardController = {
    admin: async (req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(!electionId) return response.notFound(res, "Election tidak ditemukan")
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan / belum dibuat");
            
    
            const [
                election,
                allVoter,
                presentVoter,
                voteVoter
            ] = await prisma.$transaction([
                prisma.election.findUnique({
                    where: {
                        id: electionId
                    },
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        logo: true,
                        organizerInfo: true,
                        organizerName: true
                    }
                }),
    
                
                prisma.voter.count({
                    where: {
                        electionId: electionId
                    },
                }),
    
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        isPresent: true
                    },
                }),

    
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        isVoted: true
                    },
                })
            ]);

            const result = {
                election : election,
                statistics: {
                    totalAllVoter: allVoter,
                    totalVoterPresent: presentVoter,
                    totalVoterAbsen: allVoter - presentVoter,
                    totalVoterVote: voteVoter,
                    totalVoterNotVote: allVoter - voteVoter,
                },
                percentages: {
                    presentPercentage: allVoter === 0 ? 0 : Number((presentVoter * 100 / allVoter).toFixed(1)),
                    votePercentage: allVoter === 0 ? 0 : Number((voteVoter * 100 / allVoter).toFixed(1)),
                }
            }
    
            response.success(res, result, "Berhasil mengakses data keperluan dashboard admin");
        } catch(error) {
            response.error(res, error, "Gagal mengakses data keperluan dashboard admin")
        }
    },


    petugas: async (req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(!electionId) return response.notFound(res, "TPStidak ditemukan")
            if(electionId === null) return response.error(res, false, "TPStidak ditemukan / belum dibuat");
            
            const tpsId = req.user!.tpsId;
            if(!tpsId) return response.notFound(res, "TPStidak ditemukan");
            if(tpsId === null) return response.forbidden(res);
            
            
            const [
                election,
                tps,
                allVoter,
                presentVoter,
                voteVoter
            ] = await prisma.$transaction([
                prisma.election.findUnique({
                    where: {
                        id: electionId,
                    },
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        logo: true,
                        organizerName: true,
                        organizerInfo: true
                    }
                }),


                prisma.tps.findFirst({
                    where: {
                        id: tpsId,
                        electionId: electionId
                    },
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    }
                }),
    
                
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        tpsId: tpsId
                    },
                }),
    
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        tpsId: tpsId,
                        isPresent: true
                    },
                }),

    
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        tpsId: tpsId,
                        isVoted: true
                    },
                })
            ]);

            const result = {
                election : election,
                tps: tps,
                statistics: {
                    totalAllVoter: allVoter,
                    totalVoterPresent: presentVoter,
                    totalVoterAbsen: allVoter - presentVoter,
                    totalVoterVote: voteVoter,
                    totalVoterNotVote: allVoter - voteVoter,
                },
                percentages: {
                    presentPercentage: allVoter === 0 ? 0 : Number((presentVoter * 100 / allVoter).toFixed(1)),
                    votePercentage: allVoter === 0 ? 0 : Number((voteVoter * 100 / allVoter).toFixed(1)),
                }
            }
    
            response.success(res, result, "Berhasil mengakses data keperluan dashboard tps");
        } catch(error) {
            response.error(res, error, "Gagal mengakses data keperluan dashboard tps")
        }
    }
}


export default dashboardController;