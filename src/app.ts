import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import router from './routes/api';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        name: "aplikasi pilkades",
        developer: "mas farhan"
    })
});

app.use("/api", router);


export default app;