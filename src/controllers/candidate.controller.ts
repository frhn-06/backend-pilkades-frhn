import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";
import { candidateDTO } from "../validations/candidate.validation";
import uploader from "../utils/uploader";

const candidateController = {
    create: async(req: IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");


            const validate = candidateDTO.parse(req.body);

            const candidateOld = await prisma.candidate.findUnique({
                where: {
                    electionId_nomor: {
                        electionId: electionId,
                        nomor: validate.nomor
                    }
                }
            })

            if(candidateOld) return response.error(res, false, "nomor sudah digunakan");

            const result = await prisma.candidate.create({
                data: {
                    nomor: validate.nomor,
                    img: validate.img,
                    vision: validate.vision,
                    mission: validate.mission,
                    electionId: electionId,
                    members: {
                        create: validate.members.map((member) => {
                            return {
                                name: member.name,
                                img: member.img,
                                position: member.position,
                                order: member.order,
                                electionId: electionId
                            }
                        })
                    }
                },
                include: {
                    members: {
                        select: {
                            name: true,
                            position: true,
                            order: true,
                            img: true
                        }
                    }
                }
            })

            response.success(res, result, "Berhasil membuat kandidat calon")
        } catch (error) {
            response.error(res, error, "Gagal membuat kandidat calon")
        }
    },

    findAll: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");

            const result = await prisma.candidate.findMany({
                where: {
                    electionId: electionId,
                },
                select: {
                    id: true,
                    nomor: true,
                    img: true,
                    vision: true,
                    mission: true,
                    members: {
                        select: {
                            id: true,
                            name: true,
                            img: true,
                            position: true,
                        },
                        orderBy: {
                            order: "asc"
                        }
                    },
                },
                orderBy: {
                    nomor: "asc"
                }
            })

            response.success(res, result, "Berhasil mengakses para kandidat calon")
        
        } catch(error) {
            response.error(res, error, "Gagal mengakses para kandidat calon")
        }
    },

    findOne: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");

            const {id} = req.params;

            const result = await prisma.candidate.findUnique({
                where: {
                    id: Number(id),
                    electionId: electionId
                },
                include: {
                    members: {
                        select: {
                            name: true,
                            position: true,
                            img: true,
                            order: true
                        },
                        orderBy: {
                            order: "asc"
                        }
                    }
                }
            });

            if(!result) return response.notFound(res, "Kandidat calon tidak ditemukan");

            response.success(res, result, "Berhasil mengakses para kandidat calon")
        } catch (error) {
            response.error(res, error, "Gagal mengakses kandidat calon")
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");

            const {id} = req.params;

            const updateCandidateDTO = candidateDTO.partial();
            const validate = updateCandidateDTO.parse(req.body);

            const result = await prisma.$transaction(async(tx) => {
                if(req.body.img && req.body.oldImg !== req.body.img) {
                    await uploader.removeSingle(req.body.oldImg)
                }

                const candidate = await tx.candidate.update({
                    where: {
                        id: Number(id),
                        electionId: electionId
                    },
                    data: {
                        nomor: validate.nomor,
                        img: validate.img,
                        vision: validate.vision,
                        mission: validate.mission
                    }
                });

                await tx.candidateMember.deleteMany({
                    where: {
                        candidateId: candidate.id
                    }
                })

                await tx.candidateMember.createMany({
                    data: validate.members!.map((member) => {
                        return {
                            name: member.name,
                            position: member.position,
                            order: member.order,
                            img: member.img,
                            candidateId: candidate.id,
                            electionId: electionId
                        }
                    })
                });

                return await tx.candidate.findUnique({
                    where: {
                        id: candidate.id,
                        electionId: electionId
                    },
                    include: {
                        members: {
                            select: {
                                name: true,
                                position: true,
                                img: true
                            },
                            orderBy: {
                                order: "asc"
                            }
                        }
                    }
                })
            })

            response.success(res, result, "Berhasil mengupdate kandidat calon")
        } catch (error) {
            response.error(res, error, "Gagal mengupdate kandidat calon")
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Election belum ada / belum dibuat");

            const {id} = req.params;

            const candidate = await prisma.candidate.findFirst({
                where: {
                    id: Number(id),
                    electionId: electionId
                }
            })
            if(!candidate) return response.notFound(res, "Kandidat calon tidak di temukan");

            const result = await prisma.$transaction(async(tx) => {
                await tx.candidateMember.deleteMany({
                    where: {
                        candidateId: candidate.id
                    }
                })

                const candidateDeleted = await tx.candidate.delete({
                    where: {
                        id: Number(id),
                        electionId: electionId
                    }
                })

                return candidateDeleted
            })

            response.success(res, result, "Berhasil menghapus kandidat calon")
        } catch(error) {
            response.error(res, error, "Gagal menghapus kandidat calon")
        }
    }
}

export default candidateController;