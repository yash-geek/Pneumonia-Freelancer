import express from 'express'
import { isClient } from '../middlewares/auth.js';
import {getClient, loginClient, logoutClient, newClient, getGigs, getWorkerProfile} from '../controllers/clients.js'
import { get } from 'mongoose';



const app = express.Router();

app.post('/newclient', newClient)
app.post('/loginclient',loginClient)

app.use(isClient)
app.get('/logoutclient',logoutClient)
app.get('/getclient',getClient)
app.get('/browsegigs',getGigs)
app.get('/profile/:workerId',getWorkerProfile)

export default app;