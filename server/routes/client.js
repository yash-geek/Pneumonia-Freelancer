import express from 'express'
import { isClient } from '../middlewares/auth.js';
import {getClient, loginClient, logoutClient, newClient} from '../controllers/clients.js'



const app = express.Router();

app.post('/newclient', newClient)
app.post('/loginclient',loginClient)

app.use(isClient)
app.get('/logoutclient',logoutClient)
app.get('/getclient',getClient)

export default app;