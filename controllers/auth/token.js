const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const createAccesToken = (id, userRole) =>{
    return jwt.sign(
    {
        'userID' : id,
        'userRole' : userRole
    }
    , SECRET_KEY);
}

const createRefreshToken = (id) =>{
    return jwt.sign(id, REFRESH_SECRET_KEY);
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
    createRefreshToken,
    createAccesToken,
    verifyToken
}