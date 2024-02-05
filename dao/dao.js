const pool = require('../db');
const bcrypt = require('bcrypt');

async function createUser(uid,fullName, email, gender, password){
    const connection = await pool.getConnection();
    try {
        const salt = await bcrypt.genSalt(8);
        password = await bcrypt.hash(password, salt);
        const [result] = await connection.execute('INSERT INTO users(id, fullName, email, gender, auth_string) VALUES(?, ?, ?, ?, ?);',
        [uid,fullName, email, gender,password]);
        connection.release();
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function emailExists(email){
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.
        execute('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();
        
        return rows.length > 0;

    } catch (error) {w
        console.log(error);
    }
}

async function checkUser(email, password) {
  try {
    const [rows] = await connection.
    execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    connection.release();

    return rows.length > 0;
  } catch (error) {
    console.error('Error in checkUser:', error);
    return false;
  }
}

module.exports = {
  checkUser,
  emailExists,
  createUser,
};
