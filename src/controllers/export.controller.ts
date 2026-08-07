import { Response } from "express";
import { IReqUser } from "../types/user";
import response from "../utils/response";
import reportService from "../services/report.service";
import generateResultPDF from "../utils/pdf/result";

const exportController = {
    resultPDF: async(req:IReqUser, res:Response) => {
        try {
            const electionId = req.user!.electionId;
            if(electionId === null) return response.error(res, false, "Eleksi tidak ditemukan / belum dibuat");

            
            const result  = await reportService.result(electionId);

            const Buffer = await generateResultPDF(result);

            res.setHeader("Content-Type", "application/pdf");

            res.setHeader("Content-Disposition", 'attachment; filename="result-report.pdf"');

            return res.send(Buffer)
        }catch(error) {
            response.error(res, error, "Gagal mengeksport data ke PDF")
        }
    }
}

export default exportController;