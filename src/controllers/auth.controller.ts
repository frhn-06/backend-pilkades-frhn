import { Request, Response } from "express";
import prisma from '../libs/prisma';
import response from "../utils/response";
import { loginDTO, registerDTO, resetPasswordDTO } from "../validations/user.validation";
import { UserRole } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { createTokenReset, signIn, verifyTokenReset } from "../utils/jwt";
import { IReqUser } from "../types/user";
import { publishJson } from "../utils/publishjson";
import { generateOtp } from "../utils/tokenvote";
import { generateExpired } from "../utils/tokenexpired";
import { renderHtml, sendMail } from "../utils/mail/mail";
import { MY_MAIL } from "../utils/env";

const authController = {
    register: async(req:Request, res:Response) => {
        try {
            const validate = registerDTO.parse(req.body);

            const passwordHashed = await hashPassword(validate.password);
 
           
            const result = await prisma.user.create({
                data: {
                    name: validate.name,
                    email: validate.email,
                    password: passwordHashed,
                    role: UserRole.SUPER_ADMIN
                }
            });

            const publicResult = publishJson(result)
            response.success(res, publicResult, "Berhasil Membuat User")
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
            if(!user) return response.error(res, false, "Nama atau email tidak sesuai");

            const passwordTrue = await comparePassword(validate.password, user.password);
            if(!passwordTrue) return response.error(res, false, "Password salah");

            const token = signIn({
                id: user.id,
                role: user.role,
                tpsId: user.tpsId,
                electionId: user.electionId
            });

            response.success(res, token, "Login berhasil")
        } catch(error) {
            response.error(res, error, "Logim gagal")
        }
    },

    FindMeByToken: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.unauthorize(res);

            const result = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                omit: {
                    password: true
                }
            });

            if(!result) return response.notFound(res, "User tidak ditemukan");

            response.success(res, result, "Berhasil mengambil data user")
        }catch(error) {
            response.error(res, error, "Gagal mengambil data user")
        }
    },

    findMe: async(req:IReqUser, res:Response) => {
        try{
            const userId = req.user?.id;
            if(!userId) return response.unauthorize(res);

            const result = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    tps: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    election: {
                        select: {
                            id: true,
                            logo: true
                        }
                    }
                },
                omit: {
                    password: true
                }
            });

            if(!result) return response.notFound(res, "User tidak ditemukan");

            response.success(res, result, "Berhasil mengambil data user")
        }catch(error) {
            response.error(res, error, "Gagal mengambil data user")
        }
    },

    




    forgetPassword: async(req:Request, res:Response) => {
        try {
            const {identifier} = req.body as {identifier:string}
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            name: identifier
                        },
                        {
                            email: identifier
                        }
                    ]
                }
            });

            if(!user) return response.success(res, null, "Jika Akun ditemukan, kode OTP telah terkirim. jikaaa..");

            await prisma.oTPResetPassword.updateMany({
                where: {
                    userId: user.id,
                    isUsed: false
                },
                data: {
                    isUsed: true
                }
            });

            const otp = generateOtp();

            const expiredTime = generateExpired(1000 * 60 * 60);

            const otpData = await prisma.oTPResetPassword.create({
                data: {
                    otp: otp,
                    userId: user.id,
                    expiredAt: expiredTime
                }
            });

            const contentEmail = await renderHtml("/otp-forget-password.ejs", {
                name: user.name,
                expired: otpData.expiredAt,
                token: otpData.otp
            });
            
            await sendMail({
                from: MY_MAIL,
                to: user.email,
                subject: "Ganti password",
                html: contentEmail
            });


            response.success(res, {
                status: "success"
            }, "Berhasil mengirim kode OTP ke email")
        } catch(error) {
            response.error(res, error, "Gagal mengirim kode OTP ke email")
        }
    },

    verifyOtp: async(req:Request, res:Response) => {
        try {
            const {otp} = req.body as {otp:string}

            const dataOtp = await prisma.oTPResetPassword.findFirst({
                where: {
                    otp: otp,
                    isUsed: false,
                    expiredAt: {
                        gt: new Date()
                    }
                }
            });

            if(!dataOtp) return response.notFound(res, "Kode OTP tidak ditemukan");

            await prisma.oTPResetPassword.update({
                where: {
                    id: dataOtp.id
                },
                data: {
                    isUsed: true
                }
            });

            const tokenReset = createTokenReset({
                userId: dataOtp.userId,
                purpose: "reset-password"
            });

            response.success(res, {
                resetToken: tokenReset
            }, "Verifikasi OTP berhasil")
        }catch(error) {
            response.error(res, error, "Verifikasi OTP gagal / tidak sesuai")
        }
    },


    resetPassword: async(req: Request, res:Response) => {
        try {
            const {
                password,
                confirmPassword,
                resetToken
            } = req.body as {password: string; confirmPassword: string; resetToken: string}

            const validate = resetPasswordDTO.parse({
                password,
                confirmPassword,
                resetToken
            });

            const tokenUser = verifyTokenReset(validate.resetToken);
            if(tokenUser.purpose !== "reset-password") return response.error(res, false, "Token tidak sesuai");

            const result = await prisma.$transaction(async(tx) => {
                const result = await tx.user.update({
                    where: {
                        id: tokenUser.userId
                    },
                    data: {
                        password: await hashPassword(validate.password)
                    },
                    omit: {
                        password: true
                    }
                });

                await tx.oTPResetPassword.deleteMany({
                    where: {
                        userId: result.id
                    }
                })

                return result
            })



            response.success(res, result, "Berhasil mengubah password");
        }catch(error) {
            response.error(res, error, "Gagal mengubah password");
        }
    }
}

export default authController;