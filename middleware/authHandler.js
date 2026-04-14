import jwt from "jsonwebtoken";
import { doesUserExist } from "../models/UserModel.js";
import connect from "../config/db.js";

// This is your Authentication Middleware
export const authHandler = async(req, res, next) =>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({
            success: false,
            message: [{result : "You do not have permission to access the app."}]
        });
    }
    const token = authorization.split(' ')[1];

    try{
        const {id} = jwt.verify(token, process.env.SECRET);
        const conn = await connect();
        await doesUserExist(id, conn);
        conn.release();
        next();
    }catch(err){
        res.status(401).json({
            success: false,
            message: [{result : "Request is unauthorized"}]
        });
    }
};

// Add this at the bottom: This is the Error Handler app.js is looking for
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: [{ result: err.message || "Internal Server Error" }]
    });
};