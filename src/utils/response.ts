import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Response } from "express";
import {ZodError} from 'zod';

const response = {
    success: (res: Response, data: any, message: string) => {
        return res.status(200).json({
            meta: {
                status: 200,
                message: message
            },
            data: data
        })
    },

    error: (res: Response, error: unknown, message: string) => {

        if(error instanceof ZodError) {
            const arr = error.issues.map((err) => err.message);
            const message = arr.join(", ");
            return res.status(400).json({
                meta: {
                    status: 400,
                    message: message
                }
            })
        }
        
        if(error instanceof PrismaClientKnownRequestError) {
            switch(error.code) {
                case "P2002":
                    return res.status(409).json({
                        meta: {
                            status: 409,
                            message: "Email sudah digunakan" 
                        }
                    })
                
                default:
                    return res.status(409).json({
                        meta: {
                            status: 409,
                            message: "Error database" 
                        }
                    })
            }
        }

        


        return res.status(500).json({
            meta: {
                status: 500,
                message: message,
            },
            data: error
        })
    },

    notFound: (res: Response, message: string) => {
        return res.status(404).json({
            meta: {
                status: 404,
                message: message
            }
        })
    },

    unauthorize: (res: Response) => {
        return res.status(401).json({
            meta: {
                status: 401,
                message: "unauthorized"
            }
        })
    }
}


export default response;