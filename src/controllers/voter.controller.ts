import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import { voterDTO } from "../validations/voter.validation";
import prisma from "../libs/prisma";
import { Prisma } from "@prisma/client";

const voterController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");
            
            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const validate = voterDTO.parse(req.body);

            const payload = {
                ...validate,
                electionId: electionId,
                tpsId: tpsId
            }

            const result = await prisma.voter.create({
                data: payload
            })

            response.success(res, result, "Berhasil membuat data pemilih")

        }catch(error) {
            response.error(res, error, "Gagal membuat data pemilih")
        }
    },
    findAll: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const {page = 1, limit = 20, present, voted, tps, search, } = req.query as {page: string | number; limit: string | number; present: string; voted: string; tps: string; search: string};

            const setQuery = () : Prisma.VoterWhereInput => {
                let query: Prisma.VoterWhereInput = {
                    electionId: electionId,
                };

                if(present) {
                    if(present === "true") query.isPresent = true;
                    if(present === "false") query.isPresent = false;
                }

                if(voted) {
                    if(voted === "true") query.isVoted = true;
                    if(voted === "false") query.isVoted = false;
                }

                if(tps) {
                    query.tpsId = Number(tps)
                }

                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }

                return query;
            }

            const query = setQuery()

            const result = await prisma.voter.findMany({
                where: query,
                include: {
                    tps: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    name: "asc"
                }
            });

            const totalData = await prisma.voter.count({
                where: query
            });

            response.pagination(res, result, {
                currentPage: Number(page),
                totalPage: Math.ceil(totalData / Number(limit)),
                total: totalData
            }, "Berhasil mengakses semua data pemilih")
        }catch(error) {
            response.error(res, error, "Gagal mengakses semua data pemilih")
        }
    },


    findAllPerTps: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {page = 1, limit = 20, present, voted, search, } = req.query as {page: string | number; limit: string | number; present: string; voted: string; search: string};

            const setQuery = () : Prisma.VoterWhereInput => {
                let query: Prisma.VoterWhereInput = {
                    electionId: electionId,
                    tpsId: tpsId
                };

                if(present) {
                    if(present === "true") query.isPresent = true;
                    if(present === "false") query.isPresent = false;
                }

                if(voted) {
                    if(voted === "true") query.isVoted = true;
                    if(voted === "false") query.isVoted = false;
                }


                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }

                return query;
            }

            const query = setQuery()

            const result = await prisma.voter.findMany({
                where: query,
                include: {
                    tps: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    name: "asc"
                }
            });

            const totalData = await prisma.voter.count({
                where: query
            });

            response.pagination(res, result, {
                currentPage: Number(page),
                totalPage: Math.ceil(totalData / Number(limit)),
                total: totalData
            }, "Berhasil mengakses semua data pemilih")
        }catch(error) {
            response.error(res, error, "Gagal mengakses semua data pemilih")
        }
    },
    findOne: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const {id} = req.params;

            const result = await prisma.voter.findUnique({
                where: {
                    id: Number(id),
                    electionId: electionId,
                }
            })

            if(!result) return response.notFound(res, "Voter tidak ditemukan");

            response.success(res, result, "Berhasil mengakses voter")
        }catch(error) {
            response.success(res, error, "Gagal mengakses voter")
        }
    },
    update: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {id} = req.params;

            const voterUpdateDTO = voterDTO.partial();
            const validate = voterUpdateDTO.parse(req.body);

            const result = await prisma.voter.update({
                where: {
                    id: Number(id),
                    electionId: electionId,
                    tpsId: tpsId
                }, 
                data: validate
            });

            response.success(res, result, "Berhasil mengupdate data voter")
        }catch(error) {
            response.error(res, error, "Gagal mengupdate data voter")
        }
    },

    
    present: async(req:IReqUser, res: Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {id} = req.params;

            const result = await prisma.voter.update({
                where: {
                    id: Number(id),
                    electionId: electionId,
                    tpsId: tpsId
                }, 
                data: {
                    isPresent: true
                }
            })

            response.success(res, result, "Berhasil mengubah status hadir voter")
        } catch(error) {
            response.error(res, error, "Gagal mengubah status hadir voter")
        }
    },

    voted: async(req:IReqUser, res: Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {id} = req.params;

            const result = await prisma.voter.update({
                where: {
                    id: Number(id),
                    electionId: electionId,
                    tpsId: tpsId
                }, 
                data: {
                    isVoted: true
                }
            })

            response.success(res, result, "Berhasil mengubah status suara voter")
        } catch(error) {
            response.error(res, error, "Gagal mengubah status suara voter")
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try{
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            const tpsId = req.user!.tpsId;
            if(tpsId === null) return response.forbidden(res);

            const {id} = req.params;

            const result = await prisma.voter.delete({
                where: {
                    id: Number(id),
                    electionId: electionId,
                    tpsId: tpsId
                }
            });

            response.success(res, result, "Berhasil menghapus data voter")
        }catch(error) {
            response.error(res, error, "Gagal menghapus data voter")
        }
    },
}



export default voterController;