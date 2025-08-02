import express from 'express'
import { isAuthorized } from '../middlewares/auth.js';
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
    getMyGigs,
    getOrders,
    handleOrders,
    getProfile,
    getMyGigInfo,
    answerFaqQuestion,
    } from '../controllers/worker.js'
import { attachmentMulter, singleImage } from '../middlewares/multer.js';




const app = express.Router();

app.post('/newworker',newWorker)
app.post('/loginworker',loginWorker)

app.use(isAuthorized(['worker']))
app.get('/logoutworker',logoutWorker)
app.get('/getworker',getWorker)
app.post('/createprofile',singleImage,createProfile)
app.put('/updateprofile',singleImage,updateProfile)
app.get('/getprofile',getProfile)
app.route('/mygigs')
.post(attachmentMulter,createGig)
.get(getMyGigs)

app.route('/mygigs/:id')
.get(getMyGigInfo)
.put(attachmentMulter,updateGig)
.delete(deleteGig)
app.route('/mygigs/:id/answerfaq')
.put(answerFaqQuestion)

app.get('/getorders', getOrders)

app.put('/handleorder',handleOrders)

export default app;