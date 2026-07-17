import multer from 'multer'
import { IReqUser } from '../types/user';
import { Response } from 'express';

const mimetypesLolos = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2mb
    },
    fileFilter: (req: IReqUser, file: Express.Multer.File, cb) => {
        if(!mimetypesLolos.includes(file.mimetype)) {
            return cb(new Error("Hanya file gambar yang diperbolehkan."))
        }

        cb(null, true)
    }
})

const mediaMiddleware = {
    single(fieldName: string) {
        return upload.single(fieldName)
    },
    multiple(fieldName: string) {
        return upload.array(fieldName)
    }
}

export default mediaMiddleware;