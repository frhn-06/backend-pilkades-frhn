import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";

const monitoringController = {
    admin: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const [
                totalAllVoter,
                totalVoterVote, 

                candidates,
            ] = await prisma.$transaction([
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                    }
                }),

                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        isVoted: true
                    }
                }),    
                
                prisma.candidate.findMany({
                    where: {
                        electionId: electionId
                    },
                    select: {
                        id: true,
                        img: true,
                        members: {
                            select: {
                                name: true,
                                order: true,
                                id: true
                            }
                        },
                        _count: {
                            select: {
                                votes: true
                            }
                        },
                    },
                    orderBy: {
                        id: "asc"
                    }
                })
            ]);

            const candidateResult = candidates.map((candid) => {
                return {
                    ...candid,
                    vote: candid._count.votes,
                    percentage: Number((totalVoterVote === 0 ? 0 : candid._count.votes * 100 / totalVoterVote).toFixed(2))
                }
            })

            const result = {
                progress: {
                    totalAllVoter,
                    totalVoterVote,
                    percentageVoterVote: totalAllVoter === 0 ? 0 : Number((totalVoterVote * 100 / totalAllVoter).toFixed(2))
                },
                candidates: candidateResult
            }
            response.success(res, result, "Berhasil mengakses monitoring admin");

            

        } catch(error) {
            response.error(res, error, "Gagal mengakses monitoring admin")
        }
    },

    petugas: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const [
                totalAllVoter,
                totalVoterVote, 

                candidates,

                tps
            ] = await prisma.$transaction([
                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        tpsId: tpsId
                    }
                }),

                prisma.voter.count({
                    where: {
                        electionId: electionId,
                        isVoted: true,
                        tpsId: tpsId
                    }
                }),    
                
                prisma.candidate.findMany({
                    where: {
                        electionId: electionId
                    },
                    select: {
                        id: true,
                        img: true,
                        members: {
                            select: {
                                name: true,
                                order: true,
                                id: true
                            }
                        },
                    }
                }),

                prisma.tps.findUnique({
                    where: {
                        id: tpsId
                    },
                    select: {
                        name: true,
                        location: true,
                    }
                })
            ]);

            const votes = await prisma.vote.groupBy({
                by: ["candidateId"],

                where: {
                    electionId: electionId,
                    tpsId: tpsId
                },
                _count: true
            })

            const candidateResult = candidates.map((candid) => {
                const vote = votes.find((vote) => vote.candidateId === candid.id);

                const totalVote = vote?._count?? 0;

                return {
                    ...candid,
                    vote: totalVote,
                    percentage: totalVote === 0 ? 0 : Number((totalVote * 100 / totalVoterVote).toFixed(2))
                }
            })

            const result = {
                tps,
                progress: {
                    totalAllVoter,
                    totalVoterVote,
                    percentageVoterVote: totalAllVoter === 0 ? 0 : Number((totalVoterVote * 100 / totalAllVoter).toFixed(2))
                },
                candidates: candidateResult,
            }
            response.success(res, result, "Berhasil mengakses monitoring petugas");

            

        } catch(error) {
            response.error(res, error, "Gagal mengakses monitoring petugas")
        }
    }
}

export default monitoringController;