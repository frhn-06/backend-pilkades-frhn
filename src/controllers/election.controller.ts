import { Response, Request } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import prisma from "../libs/prisma";
import { electionDTO } from "../validations/election.validation";

const electionController = {
    create: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");
            
            const election = await prisma.election.findFirst();
            if(election) return response.error(res, {}, "Election sudah ada");

            const validate = electionDTO.parse(req.body);

            const result = await prisma.election.create({
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

            response.success(res, result, "Berhasil membuat election")
        }catch(error) {
            response.error(res, error, "Gagal membuat election")
        }
    },

    findOne: async(req:Request, res: Response) => {
        try{

            const election = await prisma.election.findFirst();
            if(!election) return response.success(res, {}, "Election tiidak ditemukan/baru dibuat");

            response.success(res, election, "Berhasil mengakses elecion");
            
        }catch(error) {
            response.error(res, error, "Gagal mengakses election")
        }
    },

    update: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Elextion tida ditemukan");

            const newElectialDTO = electionDTO.partial();

            const validate = newElectialDTO.parse(req.body);
            
            const result = await prisma.election.update({
                where : {
                    id: Number(id)
                },
                data: validate
            })

            response.success(res, result, "Berhasil mengupdate data election")
        }catch(error) {
            response.error(res, error, "Gagal mengupdate data election")
        }
    },

    delete: async(req:IReqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User not found");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Elextion tida ditemukan");

            
            const result = await prisma.election.delete({
                where : {
                    id: Number(id)
                }
            })

            response.success(res, result, "Berhasil mengupdate data election")
        }catch(error) {
            response.error(res, error, "Gagal mengupdate data election")
        }
    }
}


export default electionController;