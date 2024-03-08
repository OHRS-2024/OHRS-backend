const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (uid,fullName,gender,email,phoneNumber, dateJoined) =>{
  try {
    const connection = await pool.getConnection();
        // const salt = await bcrypt.genSalt(8);
        // password = await bcrypt.hash(password, salt);
        const [result] = await connection.
        execute('INSERT INTO users(user_id, full_name ,gender, email ,phone_number ,date_joined) VALUES(?, ?, ?, ?, ?, ?);',
        [uid,fullName,gender,email,phoneNumber, dateJoined]);
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

const findUserWithId = async (uuid) =>{
  const connection = await pool.getConnection();
  try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [uuid]);
      connection.release();
      
      return rows;
  } catch (error) {
      throw error;
  }
}

const getUser = async (email) =>{

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users INNER JOIN user_auth ON users.user_id = user_auth.user_id WHERE email = ?', [email]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const updateUser = async (email, attrName, attrVal) =>{

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE users SET ? TO ? WHERE email = ?;', [attrName, attrVal, email]);
        connection.release();

        return rows;
    } catch (err) {
        throw err;
    }
}


const deleteUser = async (email) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM users WHERE email = ?;', [email]);
        connection.release();

        return rows;
    } catch (err) {
        throw err;
    }
}

const setRefreshToken = async (id,refreshToken) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('UPDATE users_auth SET refresh_token TO ? WHERE user_id = ?;', [refreshToken, id]);
        connection.release();

        return rows;
    } catch (err) {
        throw err;
    }
}

const getRefreshToken = async (id) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM refresh_tokens WHERE user_id = ?;', [id]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const getRefreshTokenByEmail = async (email) =>{
    const connection = await pool.getConnection();
    try {
        const [userId] = await connection.execute('SELECT user_id FROM users WHERE email = ?;', [email]);
        const [rows] = await connection.execute('SELECT * FROM users INNER JOIN user_auth ON users.user_id = user_auth.user_id WHERE user_id = ?',[userId[1]]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const deleteRefreshToken = async (id) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('DELETE FROM refresh_tokens WHERE id = ?;', [id]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

const checkRefreshToken = async (refreshToken) =>{
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM user_auth WHERE refresh_token = ?;', [refreshToken]);
        connection.release();
        return rows;
    } catch (err) {
        throw err;
    }
}

// const main = async () =>{
//     // const user = await getRefreshToken('e40ebbb8-db7a-11ee-b66b-e09d31beeb68');
//     // const user = await deleteRefreshToken(1);
//     // const user = await getUser('thejoel@gmail.com');
//     // const result = await createUser('eyuelid','Joel','male','0991109603','thejoel@gmail.com','03-08-2024 03:57:00');
//     console.log(user);
//     return;
// }

// main();

module.exports = {
    findUserWithId,
    createUser,
    getUser,
    registerUser,
    updateUser,
    deleteUser,
    getRefreshToken,
    setRefreshToken,
    deleteRefreshToken,
    getRefreshTokenByEmail,
    checkRefreshToken
};
