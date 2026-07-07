import {  Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import { tpsDTO } from "../validations/tps.validation";
import prisma from "../libs/prisma";
import { isValid } from "zod/v3";

const tpsController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const validate = tpsDTO.parse(req.body);
            
            const result = await prisma.tps.create({
                data: {
                    name: validate.name,
                    alamat: validate.alamat,
                    rt: validate.rt,
                    rw: validate.rw
                }
            })

            response.success(res, result, "Berhasil membuat TPS")
        }catch(error) {
            response.error(res, error, "Gagal membuat TPS")
        }
    },

    findAll: async(req:IReqUser, res: Response) => {
        try{

        }catch(error) {

        }
    },

    findByIdForAdmin: async(req:IReqUser, res: Response) => {
        try{
            const {id} = req.params;
            if(!id) return response.notFound(res, "TPS tidak ditemukan");

            const result = await prisma.tps.findFirst({
                where: {
                    id: Number(id)
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

            const result = await prisma.tps.findFirst({
                where: {
                    id: tpsId
                }
            });

            if(!result) return response.notFound(res, "TPS tidak ditemukan");
            
            response.success(res, result, "Berhasil mengakses TPS")
        }catch(error) {
            response.error(res, error, "Gagal mengakses TPS")
        }
    },
}


export default tpsController;