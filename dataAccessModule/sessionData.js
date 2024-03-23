require('dotenv').config();
const pool = require('../config/db');

const createUserSession = async (userId, token, createdAt, expiresAt) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('INSERT INTO sessions(user_id, token, created_at, expires_at)VALUES(?,?,?,?);', [userId, token, createdAt, expiresAt]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getUserSession = async (userId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM sessions WHERE user_id = ?;', [userId]);
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