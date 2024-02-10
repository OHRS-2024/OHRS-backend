const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { findUserWithId, getUser } = require('../dao/dao');
const bcrypt = require('bcrypt');

const createWebToken = (id) =>{
    return jwt.sign(id, SECRET_KEY);
}

const login_post = async (req, res) =>{

    const {email ,password} = req.body;

    if (email && password) {

        const userData = await getUser(email);
        const {auth_string, id} = userData[0];
    
        const isValid = await bcrypt.compare(password, auth_string);

        if (isValid) {

            const userToken = createWebToken(id);

            res.cookie('userToken', userToken, {
                maxAge: (1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            });      
            res.status(200).redirect('/pages/home');
        }else{
            res.status(401).redirect('/auth/login');
        }
    }
}

const login_get = async (req, res) =>{
    if (req.cookies && req.cookies.userToken) {

        try {
            const decoded = verifyToken(req.cookies.userToken, SECRET_KEY);
            const userData = await findUserWithId(decoded);

            res.status(200).redirect('pages/home');
        } catch (err) {
            console.log(err);
        }

    }else{
        res.status(200).render('login');
    }
}

const verifyToken = (token, key) =>{

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            throw err;
        } else {
            return decoded;
        }
      });
      
}

module.exports = {
    login_get,
    login_post,
}