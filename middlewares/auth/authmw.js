const { findUserWithId } = require("../../dao/dao");
const { verifyToken } = require('../../utils/token');
const SECRET_KEY = process.env.SECRET_KEY;

const logger = (req, res, next) =>{
    const method = req.method;
    const path = req.path;
    const ip = req.ip;
    
    console.log(`${method} ${res.statusCode || 404} ${path} ${ip}`);
    next();
}

const checkAuthorized = async (req, res, next) =>{

    if (req.cookies && req.cookies.userToken) {
        const userAuthenticated = await verifyUser(req.cookies.userToken);
        userAuthenticated ? next() : res.status(401).redirect('/auth/login');
    }else{
        res.status(401).redirect('/auth/login');
    }
    
}


const checkLoggedIn = async (req, res, next) =>{

    if (req.cookies && req.cookies.userToken) {
        console.log(req.cookies.userToken);
        const userAuthenticated = await verifyUser(req.cookies.userToken);
        userAuthenticated ? res.status(200).redirect('/pages/home') : next();
    }else{
        next();
    }
}

const verifyUser = async (userToken) =>{
    try {
        const decoded = verifyToken(userToken, SECRET_KEY);
        const [row] = await findUserWithId(decoded);
        if (row) {
            return true;
        }else{
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    logger,
    checkLoggedIn,
    checkAuthorized,
}
