import { Response, Request } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";
import { electionDTO, statusDTO } from "../validations/election.validation";
import { ElectionStatus } from "@prisma/client";

const electionController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(!user) return response.notFound(res, "User tidak ditemukan")
            if(user.electionId !== null) return response.error(res, false, "User sudah punya election");
            
            const validate = electionDTO.parse(req.body);

            const result = await prisma.$transaction(async(tx) => {
                const election = await tx.election.create({
                    data: {
                        name: validate.name,
                        desa: validate.desa,
                        kecamatan: validate.kecamatan,
                        kabupatenKota: validate.kabupatenKota,
                        provinsi: validate.provinsi,
                        startAt: validate.startAt,
                        endAt: validate.endAt
                    }
                });
    
                await tx.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        electionId: election.id
                    }
                });

                return election;
            })


            response.success(res, result, "Berhasil membuat election")
        }catch(error) {
            response.error(res, error, "Gagal membuat election")
        }
    },

    findOne: async(req:IReqUser, res: Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");
            
            const electionId = req.user?.electionId;
            if(electionId === null) return response.success(res, {}, "Election belum dibuat");

            const election = await prisma.election.findUnique({
                where: {
                    id: electionId
                }
            });
            if(!election) return response.notFound(res, "Election tidak ditemukan");

            response.success(res, election, "Berhasil mengakses elecion");
            
        }catch(error) {
            response.error(res, error, "Gagal mengakses election")
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.success(res, false, "Election belum dibuat");

            const electionUpdateDTO = electionDTO.partial();

            const validate = electionUpdateDTO.parse(req.body);
            
            const result = await prisma.election.update({
                where : {
                    id: electionId,
                },
                data: validate
            })
        
            response.success(res, result, "Berhasil mengupdate data election")
        } catch(error) {
            response.error(res, error, "Gagal mengupdate data election")
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.success(res, false, "Election belum dibuat");

            
            const result = await prisma.$transaction(async(tx) => {
                await tx.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        electionId: null
                    }
                });

                await tx.tps.deleteMany({
                    where: {
                        electionId: electionId
                    }
                })

                const election = await tx.election.delete({
                    where: {
                        id: electionId
                    }
                })

                return election
            })

            response.success(res, result, "Berhasil menghapus data election")
        }catch(error) {
            response.error(res, error, "Gagal menghapus data election")
        }
    },


    status: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.success(res, false, "Election belum dibuat");

            const validate = statusDTO.parse(req.body);

            const result = await prisma.election.update({
                where : {
                    id: electionId,
                },
                data: {
                    status: validate.status
                }
            })
        
            response.success(res, result, "Berhasil mengubah status election")
        }catch(error){
            response.error(res, error, "Gagal mengubah status election")
        }
    },

    
}


export default electionController;