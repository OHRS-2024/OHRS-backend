require('dotenv').config();
const pool = require('../config/db');

const createUserSession = async (sessionId,userId,userRole,userAgent,origin,createdAt,expiresAt) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('INSERT INTO sessions(session_id,user_id,user_role,user_agent,user_ip,created_at,expires_at)VALUES(?,?,?,?,?,?,?);', [sessionId,userId,userRole,userAgent,origin,createdAt,expiresAt]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getUserSession = async (sessionId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM sessions WHERE session_id = ?;', [sessionId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getUserSessionByEmail = async (email) =>{

    const connection = await pool.getConnection();
    try {
        const [[userId]] = await connection.execute('SELECT user_id FROM users WHERE email = ?;', [email]);
        const [rows] = await connection.execute('SELECT * FROM sessions WHERE user_id = ?;',[userId.user_id]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const deleteUserSession = async (sessionId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM sessions WHERE session_id = ?;', [sessionId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    deleteUserSession,
    createUserSession,
    getUserSession,
    getUserSessionByEmail,   
}