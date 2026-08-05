import dotenv from 'dotenv'

dotenv.config();


export const DATABASE_URL = process.env.DATABASE_URL || "";
export const SECRET = process.env.SECRET || "";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export const PASSWORD_MAIL = process.env.PASSWORD_MAIL || "";
export const MY_MAIL = process.env.MY_MAIL || "";

export const RESET_PASSWORD_RESET = process.env.RESET_PASSWORD_RESET || "";