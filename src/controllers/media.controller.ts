import {Response} from "express";
import response from "../utils/response";
import { IReqUser } from "../types/user";
import uploader from "../utils/uploader";

const mediaController = {
    uploadSingle: async(req: IReqUser, res:Response) => {
        try{
            const file = req.file;

            if(!file) return response.notFound(res, "file is not found");
            
            const result = await uploader.uploadSingle(file);

            response.success(res, result, "success to upload a media");
        }catch(error) {
            return response.error(res, error, "failed to upload a media");
        }
    },

    removeSingle: async(req: IReqUser, res: Response) => {
        try{
            const {url} = req.body as {url : string}

            const result = await uploader.removeSingle(url);

            response.success(res, result, "success to remove a media");
        }catch(error) {
            return response.error(res, error, "failed to remove a media");
        }
    }
}


export default mediaController;