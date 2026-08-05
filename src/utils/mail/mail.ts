import nodemailer from 'nodemailer'
import { MY_MAIL, PASSWORD_MAIL } from '../env'

import ejs from 'ejs'
import path from 'path'
import { object } from 'zod'



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MY_MAIL,
        pass: PASSWORD_MAIL
    }
})





interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}




const renderHtml = async (nameFile: string, data:any) => {
    const content = await ejs.renderFile(path.join(__dirname, "/content", nameFile), data);
    return content as string;
}


const sendMail = async (obj: ISendMail) => {
    const result = await transporter.sendMail({
        from: obj.from,
        to: obj.to,
        subject: obj.subject,
        html: obj.html
    });

    return result
}


export {renderHtml, sendMail}