import { Request, Response } from "express";
import prisma from '../libs/prisma';
import response from "../utils/response";
import { registerDTO } from "../validations/user.validation";
import { UserRole } from "../generated/prisma/enums";
import { hashPassword } from "../utils/bcrypt";

const authController = {
    register: async(req:Request, res:Response) => {
        try {
            const validate = registerDTO.parse(req.body);

            const userSama = await prisma.user.findFirst({
                where: {
                    role: "SUPER_ADMIN"
                }
            })
            if(userSama) return response.error(res, {}, "admin sudah ada");

            const passwordHashed = await hashPassword(validate.password);
 
           
            const result = await prisma.user.create({
                data: {
                    name: validate.name,
                    email: validate.email,
                    password: passwordHashed,
                    role: UserRole.SUPER_ADMIN
                }
            });

            response.success(res, result, "Berhasil Membuat User")
        } catch(error) {
            response.error(res, error, "Gagal Membuat User")
        }
    }
}

export default authController;