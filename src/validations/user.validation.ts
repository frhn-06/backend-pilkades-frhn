import zod, { z } from 'zod';

const passwordDTO = z.string().trim().min(4, "Password minimal 4 huruf")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/\d/, "Password harus mengandung angka");

const registerDTO = zod.object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter").max(300),
    email: z.email("Format email tidak valid").trim(),
    password: passwordDTO,
    confirmPassword: z.string().trim(),
})
.refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"]
})

const loginDTO = zod.object({
    identifier: z.string(),
    password: z.string()
})


export {registerDTO, loginDTO}