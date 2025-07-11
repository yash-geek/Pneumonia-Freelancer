import express from 'express'
import { isWorker } from '../middlewares/auth.js';
import {
    createProfile, 
    updateProfile, 
    getWorker, 
    loginWorker, 
    logoutWorker, 
    newWorker, 
    createGig, 
    updateGig, 
    deleteGig,
    getMyGigs
    } from '../controllers/worker.js'
import { attachmentMulter, singleImage } from '../middlewares/multer.js';




const app = express.Router();

app.post('/newworker',newWorker)
app.post('/loginworker',loginWorker)

app.use(isWorker)
app.get('/logoutworker',logoutWorker)
app.get('/getworker',getWorker)
app.post('/createprofile',singleImage,createProfile)
app.put('/updateprofile',singleImage,updateProfile)
app.route('/mygigs')
.post(attachmentMulter,createGig)
.get(getMyGigs)

app.route('/mygigs/:id')
.put(attachmentMulter,updateGig)
.delete(deleteGig)

export default app;