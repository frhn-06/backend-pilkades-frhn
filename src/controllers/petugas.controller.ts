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
            const userId = req.user?.id;
            const role = req.user?.role;
            if(!userId || role !== "SUPER_ADMIN") return response.error(res, false, "Unauthorized / Forbidden");

            const validate = petugasDTO.parse(req.body);

            const tps = await prisma.tps.findUnique({
                where: {
                 id: validate.tpsId
                }
            });

            if(!tps) return response.notFound(res, "TPS tidak ditemukan");
            
            const passwordHashed = await hashPassword(validate.password);

            const payload = {
                name: validate.name,
                email: validate.email,
                password:passwordHashed,
                tpsId: validate.tpsId,
                role: UserRole.PETUGAS
            }

            const result = await prisma.user.create({
                data: payload
            });

            const publicResult = publishJson(result);

            response.success(res, publicResult, "Berhasil mebuat data petugas")
        }catch(error) {
            response.error(res, error, "Gagal membuat petugas");
        }
    },

    findAll: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            if(!userId || role !== "SUPER_ADMIN") return response.error(res, false, "Unauthorized / Forbidden");

            const {limit = 8, page = 1, tps, active, search} = req.query as {limit:string, page:string, tps: string, active:string, search: string}

            const setQuery = ():Prisma.UserWhereInput => {
                let query :Prisma.UserWhereInput  = {
                    isActive: true,
                    role: UserRole.PETUGAS
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
                    createdAt: "desc"
                }
            });

            const total = await prisma.user.count({
                where: query
            })

            const publicResult = publishManyJson(result)

            response.pagination(res, publicResult, {totalPage: Math.ceil(total / Number(limit)), currentPage: Number(page), total: total}, "Berhasil mengakses petugas")

        } catch(error) {
            response.error(res, error, "Gagal mengakses petugas");
        }
    },

    findOne: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            const role = req.user?.role;
            if(!userId || role !== "SUPER_ADMIN") return response.error(res, false, "Unauthorized / Forbidden");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const result = await prisma.user.findFirst({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS
                }
            });

            if (!result) {
                return response.notFound(res, "Petugas tidak ditemukan");
            }

            const publicResult = publishJson(result)

            response.success(res, publicResult, "Berhasil mengakses seorang petugas");
            

        }catch(error) {
            response.error(res, error, "Gagal mengakses seorang petugas");
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            const role = req.user?.role;
            if(!userId || role !== "SUPER_ADMIN") return response.error(res, false, "Unauthorized / Forbidden");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const newPetugasDTO = petugasDTO.partial();

            newPetugasDTO.parse(req.body);

            const result = await prisma.user.update({
                where: {
                    id: Number(id),
                    role: UserRole.PETUGAS
                },
                data: req.body
            });

            const publicResult = publishJson(result)

            response.success(res, publicResult, "Berhasil mengupdate data petugas");
            

        }catch(error) {
            response.error(res, error, "Gagal mengupdate data petugas");
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            if(!userId || role !== "SUPER_ADMIN") return response.error(res, false, "Unauthorized / Forbidden");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Petugas tidak ditemukan");

            const result = await prisma.user.delete({
                where: {
                    id: Number(id)
                }
            });

            const publicResult = publishJson(result)

            response.success(res, publicResult, "Berhasil menghapus data petugas");
        } catch(error) {
            response.error(res, error, "Gagal menghapus data petugas");   
        }
    }
}

export default petugasController;