import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.DBPASSWORD || '',
    database: process.env.DATABASE,
    port: process.env.DB_PORT || 3000,
    waitForConnections: true,
    connectionLimit: 10
});

const connect = async () => {
    return await pool.getConnection();
};

export default connect;