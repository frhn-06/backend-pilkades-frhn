import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import { petugasDTO } from "../validations/user.validation";
import prisma from "../libs/prisma";
import { hashPassword } from "../utils/bcrypt";
import { Prisma, UserRole } from "@prisma/client";
import {publishJson, publishManyJson} from "../utils/publishjson";

const petugasController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const validate = petugasDTO.parse(req.body);

            const tps = await prisma.tps.findFirst({
                where: {
                 id: validate.tpsId,
                 electionId: electionId
                }
            });

            if(!tps) return response.notFound(res, "TPS tidak ditemukan");
            
            const passwordHashed = await hashPassword(validate.password);

            const payload = {
                name: validate.name,
                email: validate.email,
                password:passwordHashed,
                tpsId: validate.tpsId,
                role: UserRole.PETUGAS,
                electionId: electionId
            }

            const result = await prisma.user.create({
                data: payload,
                omit: {
                    password: true
                }
            });

            response.success(res, result, "Berhasil mebuat data petugas")
        }catch(error) {
            response.error(res, error, "Gagal membuat petugas");
        }
    },

    findAll: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const {limit = 8, page = 1, tps, active, search} = req.query as {limit:string, page:string, tps: string, active:string, search: string}

            const setQuery = ():Prisma.UserWhereInput => {
                let query :Prisma.UserWhereInput  = {
                    isActive: true,
                    role: UserRole.PETUGAS,
                    electionId: electionId
                };
                if(tps) {
                    query.tpsId = Number(tps)
                }
                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                if(active === "false") {
                    query.isActive = false
                }

                return query;
            }

            const query = setQuery()

            const result = await prisma.user.findMany({
                where: query,
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
                orderBy: {
                    name: "asc"
                },
                include: {
                    tps: {
                        select: {
                            id: true,
                            name: true,
                            location: true
                        }
                    }
                },
                omit: {
                    password: true
                }
            });

            const total = await prisma.user.count({
                where: query
            })

            response.pagination(res, result, {
                    totalPage: Math.ceil(total / Number(limit)), 
                    currentPage: Number(page), 
                    total: total
                }, "Berhasil mengakses petugas")

        } catch(error) {
            response.error(res, error, "Gagal mengakses petugas");
        }
    },

    findOne: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat") 

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const result = await prisma.user.findFirst({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS,
                    electionId: electionId
                },
                omit: {
                    password: true
                }
            });

            if (!result) {
                return response.notFound(res, "Petugas tidak ditemukan");
            }

            response.success(res, result, "Berhasil mengakses seorang petugas");
            

        }catch(error) {
            response.error(res, error, "Gagal mengakses seorang petugas");
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const newPetugasDTO = petugasDTO.partial();

            const {passsword, ...body} = req.body;

            const validate = newPetugasDTO.parse(body);

            const result = await prisma.user.update({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS,
                    electionId: electionId
                },
                data: validate,
                omit: {
                    password: true
                }
            });

            response.success(res, result, "Berhasil mengupdate data petugas");
        }catch(error) {
            response.error(res, error, "Gagal mengupdate data petugas");
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const result = await prisma.user.delete({
                where: {
                    id: Number(id),
                    electionId: electionId
                },
                omit: {
                    password: true
                }
            });

            response.success(res, result, "Berhasil menghapus data petugas");
        } catch(error) {
            response.error(res, error, "Gagal menghapus data petugas");   
        }
    },

    nonActive: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan")
            
            const result = await prisma.user.update({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS,
                    electionId: electionId
                },
                data: {
                    isActive: false
                },
                omit: {
                    password: true
                }
            })

            response.success(res, result, "Berhasil mengnonaktifkan data petugas");

        } catch (error) {
            response.error(res, error, "Gagal mengnonaktifkan data petugas");      
        }
    },

    active: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan")
            
            const result = await prisma.user.update({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS,
                    electionId: electionId
                },
                data: {
                    isActive: true
                },
                omit: {
                    password: true
                }
            })

            response.success(res, result, "Berhasil mengaktifkan data petugas");

        } catch (error) {
            response.error(res, error, "Gagal mengaktifkan data petugas");      
        }
    }
}

export default petugasController;