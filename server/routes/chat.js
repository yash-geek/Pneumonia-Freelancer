import express from 'express'
import { isAuthorized } from '../middlewares/auth.js';
import { 
    getMessages,
} from '../controllers/chat.js';
const app = express.Router();


app.use(isAuthorized(['worker','client']))
app.get('/getmessages/:orderId',getMessages)

export default app;