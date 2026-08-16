import {Server, Socket} from 'socket.io'
import {Server as HttpServer} from 'http' 
import { SECRET } from '../utils/env';
import jwt from 'jsonwebtoken'



interface ISocketUser {
    id: number;
    role: string;
    tpsId: number | null;
    electionId: number| null;
}

interface IAuthSocket extends Socket {
    user?: ISocketUser;
}

let io: Server;

const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3001"
        }
    });


    io.use((socket, next) => {
        const authSocket = socket as IAuthSocket;
        const token = socket.handshake.auth.token;

        try {
            const decode = jwt.verify(token, SECRET) as ISocketUser;

            authSocket.user = decode;
            
            next();
        } catch(error) {
            next(new Error("Unauthorized"))
        }
    })


    io.on("connection", (socket) => {
    
        const electionId = (socket as IAuthSocket).user?.electionId;

        const tpsId = (socket as IAuthSocket).user?.tpsId;

        const role = (socket as IAuthSocket).user?.role;

        if(electionId && role === "SUPER_ADMIN") {
            socket.join(`election:${electionId}`);
        }

        if(electionId && tpsId !== null && role === "PETUGAS") {
            socket.join(`election:${electionId}-tps:${tpsId}`);
        }
        
        socket.on("disconnect", () => {
            console.log("klien yg ber id ", socket.id, " putus koneksi")
        })
    })

    return io
}

const getIo = () => {
    return io;
}

export {initializeSocket, getIo}
