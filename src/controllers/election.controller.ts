import { Response, Request } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";
import { electionDTO, logoDTO, statusDTO } from "../validations/election.validation";
import { UserRole } from "@prisma/client";
import uploader from "../utils/uploader";

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
                        startAt: validate.startAt,
                        endAt: validate.endAt,
                        organizerInfo: validate.organizerInfo,
                        organizerName: validate.organizerName,
                        description: validate.description
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
            if(electionId === null) return response.success(res, false, "Election belum dibuat");

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
                        id: userId,
                    },
                    data: {
                        electionId: null,
                        tpsId: null
                    }
                });

                await tx.user.deleteMany({
                    where: {
                        electionId: electionId,
                        role: UserRole.PETUGAS
                    }
                })

                const election = await tx.election.delete({
                    where: {
                        id: electionId
                    }
                })

                if(election.logo !== null) {
                    await uploader.removeSingle(election.logo)
                }

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

    updateLogo: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user?.electionId;
            if(electionId === null) return response.success(res, false, "Election belum dibuat");

            const election = await prisma.election.findUnique({
                where: {
                    id: electionId
                }
            })
            if(!election) return response.notFound(res, "Election tidak ditemukan");

            const validate = logoDTO.parse(req.body);

            
            const result = await prisma.$transaction(async(tx) => {
                const result = await tx.election.update({
                    where: {
                        id: election.id
                    },
                    data: {
                        logo: validate.logo
                    },
                });

                if(election.logo !== null && election.logo.startsWith("https://res.cloudinary.com")) {
                    await uploader.removeSingle(election.logo);
                }

                return result
            });

            response.success(res, result, "Berhasil mengupdate logo election");

            console.log()
        } catch(error) {
            response.error(res, error, "Gagal mungupdate logo elction")
        }
    }
}


export default electionController;