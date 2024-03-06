const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const createWebToken = (id) =>{
    return jwt.sign(id, SECRET_KEY);
}

const verifyToken = (token, key) => {
    let decoded = ""
    jwt.verify(token, key , (err, dec) =>{
        if (err && !dec) {
            throw err;
        }else{
            decoded = dec;        
        }
    });
    return decoded;
}


module.exports = {
    createWebToken,
    verifyToken
}