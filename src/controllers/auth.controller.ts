import { Request, Response } from "express";
import prisma from '../libs/prisma';
import response from "../utils/response";
import { loginDTO, registerDTO } from "../validations/user.validation";
import { UserRole } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { signIn } from "../utils/jwt";

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
    },

    login: async(req:Request, res:Response) => {
        try {
            const validate = loginDTO.parse(req.body);

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            email: validate.identifier
                        },
                        {
                            name: validate.identifier
                        }
                    ]
                }
            });
            if(!user) return response.error(res, {}, "Nama atau email tidak sesuai");

            const passwordTrue = await comparePassword(validate.password, user.password);
            if(!passwordTrue) return response.error(res, {}, "Password salah");

            const token = signIn({
                id: user.id,
                role: user.role
            });

            response.success(res, token, "Login berhasil")
        } catch(error) {
            response.error(res, error, "Logim gagal")
        }
    },


}

export default authController;