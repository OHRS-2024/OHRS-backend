require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (userId,fullName,gender,email,phoneNumber, dateJoined, authString, userRole) =>{
  try {
    const connection = await pool.getConnection();
        const [result] = await connection.
        execute('INSERT INTO users(user_id, full_name ,gender, email ,phone_number ,date_joined) VALUES(?, ?, ?, ?, ?, ?);',
        [userId,fullName,gender,email,phoneNumber, dateJoined]);
        connection.release();
        return result;
    } catch (error) {
        throw error;
    }
}

const createUserAuth = async (userId, authString, userRole) =>{
    try {
        const connection = await pool.getConnection();
            const [result] = await connection.
            execute('INSERT INTO user_auth(user_id, auth_string ,user_role) VALUES(?, ?, ?);',
            [userId, authString, userRole]);
            connection.release();
            return result;
    } catch (error) {
        throw error;
    }
}

const registerUser  = async (userId, authString, userRole) =>{
    try {
        const connection = await pool.getConnection();
            const [result] = await connection.
            execute('INSERT INTO users(user_id, full_name ,gender ,phone_number ,date_joined) VALUES(?, ?, ?, ?, ?);',
            [userId, authString, userRole]);
            connection.release();
            return result;
        } catch (error) {
            throw error;
        }
}

const getUser = async (userId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users INNER JOIN user_auth ON users.user_id = user_auth.user_id WHERE users.user_id = ?', [userId]);
        connection.release();
        return rows[0];
    } catch (err) {
        throw err;
    }
}

const getUserByEmail = async (email) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users INNER JOIN user_auth ON users.user_id = user_auth.user_id WHERE email = ?', [email]);
        connection.release();
        return rows[0];
    } catch (err) {
        throw err;
    }
}

const getPageUser = async (page) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users INNER JOIN user_auth ON users.user_id = user_auth.user_id;');
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const updateUser = async (userId, attrName, attrVal) =>{

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE users SET ? = ? WHERE user_id = ?;', [attrName, attrVal, userId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const changeUserStatus = async (userId, status) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE users SET STATUS = ? WHERE user_id = ?;', [status ,userId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getUserStatus = async (userId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT STATUS FROM users WHERE user_id = ?;', [userId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getUserInfo = async (userId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE user_id = ?;', [userId]);
        connection.release();
        return rows[0];
    } catch (err) {
        throw err;
    }
}

const deleteUser = async (userId) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM users WHERE user_id = ?;', [userId]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createUser,
    createUserAuth,
    changeUserStatus,
    getUserStatus,
    getUser,
    getUserByEmail,
    getPageUser,
    registerUser,
    updateUser,
    deleteUser,
    getUserInfo
};
