import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { corsOptions } from './constants/config.js';

import clientRoute from './routes/client.js'
import workerRoute from './routes/freelancer.js'
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

dotenv.config({
    path: './.env',
})

const mongoURI = process.env.MONGO_URI
connectDB(mongoURI)

const port = process.env.PORT || 3000
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const app = express();
const server = createServer(app);


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/api/v1/client', clientRoute)
app.use('/api/v1/worker', workerRoute)


app.get('/', (req, res) => {
    res.send('Hello World');
})


app.use(errorMiddleware)
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port} in ${envMode} mode`)
})
export {
   envMode
};