import {  Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import { tpsDTO } from "../validations/tps.validation";
import prisma from "../libs/prisma";
import { UserRole } from "@prisma/client";

const tpsController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(!electionId || electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat");

            const validate = tpsDTO.parse(req.body);
            
            const result = await prisma.tps.create({
                data: {
                    name: validate.name,
                    alamat: validate.alamat,
                    rt: validate.rt,
                    rw: validate.rw,
                    electionId: electionId
                }
            })

            response.success(res, result, "Berhasil membuat TPS")
        }catch(error) {
            response.error(res, error, "Gagal membuat TPS")
        }
    },

    findAll: async(req:IReqUser, res: Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat");

            const result = await prisma.tps.findMany({
                where: {
                    electionId: electionId
                },
                orderBy: {
                    name: "asc"
                }
            });
            
            response.success(res, result, "Berhasil mengakses semua TPS");
        }catch(error) {
            response.error(res, error, "Gagal mengakses semua TPS");
        }
    },

    findByIdForAdmin: async(req:IReqUser, res: Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat");

            const {id} = req.params;
            if(!id) return response.notFound(res, "TPS tidak ditemukan");

            const result = await prisma.tps.findFirst({
                where: {
                    id: Number(id),
                    electionId: electionId
                }
            });

            if(!result) return response.notFound(res, "TPS tidak ditemukan");
            
            response.success(res, result, "Berhasil mengakses TPS")
        }catch(error) {
            response.error(res, error, "Gagal mengakses TPS")
        }
    },

    findByPetugas: async(req:IReqUser, res: Response) => {
        try{
            const tpsId = req.user?.tpsId;
            if(!tpsId || typeof tpsId !== "number") return response.notFound(res, "TPS tidak ditemukan");

            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat");

            const result = await prisma.tps.findFirst({
                where: {
                    id: tpsId,
                    electionId: electionId
                }
            });

            if(!result) return response.notFound(res, "TPS tidak ditemukan");
            
            response.success(res, result, "Berhasil mengakses TPS")
        }catch(error) {
            response.error(res, error, "Gagal mengakses TPS")
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.unauthorize(res);

            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat");

            const {id} = req.params;;
           
            const updateTpsDTO = tpsDTO.partial();
            const validate = updateTpsDTO.parse(req.body);

            const result = await prisma.tps.update({
                where: {
                    id: Number(id),
                    electionId: electionId
                },
                data: validate
            });

            if(!result) return response.notFound(res, "TPS tidak ditemukan");

            response.success(res, result, "Berhasil mengubah data TPS");
            
        }catch(error) {
            response.error(res, error, "Gagal mengubah data TPS")
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.unauthorize(res);

            const electionId = req.user?.electionId;
            if(electionId === null) return response.error(res, false, "Election tidak ditemukan/ belum dibuat")
            const {id} = req.params;

            const result = await prisma.$transaction(async(tx) => {
                await tx.user.deleteMany({
                    where: {
                        electionId: electionId,
                        tpsId: Number(id),
                        role: UserRole.PETUGAS
                    }
                })

                const result = await tx.tps.delete({
                    where: {
                        id: Number(id),
                        electionId: electionId
                    }
                })

                return result
            })


            if(!result) return response.notFound(res, "TPS tidak ditemukan");

            response.success(res, result, "Berhasil menghapus data TPS");
        }catch(error) {
            response.error(res, error, "Gagal menghapus data TPS")
        }
    }
}


export default tpsController;