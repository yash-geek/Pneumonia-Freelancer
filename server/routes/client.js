import express from 'express'
import { isAuthorized } from '../middlewares/auth.js';
import {
    getClient, 
    loginClient,
    logoutClient, 
    newClient, 
    getGigs, 
    getWorkerProfile, 
    createNewOrder, 
    getOrders,
    cancelOrder,
    getGigInfo,
    askQuestion,
    rateOrders,
    getOrderDetails,
    createStripeSession
} from '../controllers/clients.js'



const app = express.Router();

app.post('/newclient', newClient)
app.post('/loginclient',loginClient)

app.use(isAuthorized(['client']))
app.get('/logoutclient',logoutClient)


app.get('/getclient',getClient)

//gig related routes
app.get('/browsegigs',getGigs)
app.get('/gigs/:id',getGigInfo)
app.put('/gigs/:id',askQuestion) 


app.get('/profile/:workerId',getWorkerProfile)
app.post('/createorder',createNewOrder)
app.put('/rateorder',rateOrders)
app.get('/orders',getOrders)
app.get('/order/:orderId',getOrderDetails)
app.put('/orders',cancelOrder)
app.post('/stripe/create', createStripeSession);


export default app;