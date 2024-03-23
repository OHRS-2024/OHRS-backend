const pool = require('../config/db');
require('dotenv').config();

const createVerificationKey = async (userId, key, createdAt, expiresAt) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('INSERT INTO verification_keys(user_id, verification_key, created_at, expires_at)VALUES(?,?,?,?);', [userId, key, createdAt, expiresAt]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getVerificationKey = async (key) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM verification_keys WHERE verification_key = ?;', [key]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    createVerificationKey,
    getVerificationKey
}