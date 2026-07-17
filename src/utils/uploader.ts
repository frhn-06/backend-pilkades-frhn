import {v2 as cloudinary} from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from './env';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})


const toUrl = (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const data = `data:${file.mimetype};base64,${b64}`;
    return data;
}

const toPublish = (url: string) => {
    const pathname = url.substring(url.lastIndexOf("/") + 1)
    const goPublic = pathname.substring(0, pathname.lastIndexOf("."));
    return goPublic;
}

const uploader = {
    uploadSingle: async(file: Express.Multer.File) => {
        const fileUrl = toUrl(file);
        const result = await cloudinary.uploader.upload(fileUrl, {
            resource_type: "auto",
        })

        return result;
    },

    removeSingle: async(url: string) => {
        const data = toPublish(url)
        const result = await cloudinary.uploader.destroy(data);
        return result;
    }
}

export default uploader;
