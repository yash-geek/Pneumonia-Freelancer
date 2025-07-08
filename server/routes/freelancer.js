import express from 'express'
import { isWorker } from '../middlewares/auth.js';
import {getWorker, loginWorker, logoutWorker, newWorker} from '../controllers/worker.js'


const app = express.Router();

app.post('/newworker', newWorker)
app.post('/loginworker',loginWorker)

app.use(isWorker)
app.get('/logoutworker',logoutWorker)

app.get('/getworker',getWorker)

export default app;