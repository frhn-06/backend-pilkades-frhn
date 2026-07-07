import bcrypt from 'bcrypt';

const saltRonde = 10

const hashPassword = async (password:string): Promise<string> => {
    return await bcrypt.hash(password, saltRonde)
}



const comparePassword = async(password: string, dataPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, dataPassword);
}

export {hashPassword, comparePassword}