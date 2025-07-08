import jwt from 'jsonwebtoken';
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";

const isClient = TryCatch((req, res, next) => {
    const token = req.cookies['pneumonia-client-token'];
    if (!token)
        return next(new ErrorHandler("Please login as client", 401));
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decodedData._id, role: "client" };
    next();
});

const isWorker = TryCatch((req, res, next) => {
    const token = req.cookies['pneumonia-worker-token'];
    if (!token)
        return next(new ErrorHandler("Please login as worker", 401));
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedData._id, role: "worker" };
    next();
});

export {isClient, isWorker}