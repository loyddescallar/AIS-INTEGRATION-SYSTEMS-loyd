import connect from "../config/db.js";
import * as UserModel from "../models/UserModel.js";

export const register = async (req, res, next) => {
    const { name, birthdate, address, program, studentStatus, email, password } = req.body;
    let conn;
    try {
        conn = await connect();
        const userProfile = { name, birthdate, address, program, studentStatus };
        const user = await UserModel.createUser(name, userProfile, email, password, conn);
        
        conn.release();
        res.status(201).json({
            success: true,
            message: [{ result: "A new account has been created!" }]
        });
    } catch (e) {
        if (conn) conn.release();
        next(e);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let conn;
    try {
        conn = await connect();
        const token = await UserModel.login(email, password, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                { result: "Login successful!" },
                { token }
            ]
        });
    } catch (e) {
        if (conn) conn.release();
        next(e);
    }
};