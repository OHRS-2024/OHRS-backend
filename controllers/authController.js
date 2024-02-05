const {createUser} = require('../dao/dao');
const checkRegInfo = require('./regController');
const { emailExists } = require('../dao/dao');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createWebToken = (id) =>{
    return jwt.sign(id, "secret123");
}

const register_post = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, password, passwordRepeat } = req.body;
        const regErrs = await checkRegInfo({ firstName, lastName, password, passwordRepeat });

        try {
            const emailExistsResult = await emailExists(email);
            regErrs[2] = emailExistsResult ? 1 : 0;
        } catch (error) {
            console.error("Error checking if email exists:", error);
            regErrs[2] = 1;
        }

        if (!regErrs.some(e => e === 1)) {
            
            const uid = crypto.randomUUID();
            const fullName = `${firstName} ${lastName}`;
            const result = await createUser(uid, fullName, email, gender, password);

            console.log(uid, fullName, email, gender, password);

            if (result.affectedRows > 0) {
                const userToken = createWebToken(uid);
                res.cookie('userToken', userToken, {
                    maxAge: (1000 * 60 * 60 * 24 * 30),
                    httpOnly: true
                });
                res.status(200).json({ 
                    response : regErrs,
                    error : null });
            } else {
                res.status(500).json({ 
                    response : regErrs,
                    error: 'Failed to create user!' });
            }
        } else {
            res.status(400).json({ 
                response: regErrs,
                error : 'Error from client!'
             });
        }
    } catch (error) {
        console.error("Error in register_post:", error);
        res.status(500).json({ 
            response : null,
            error: 'Internal server error'});
    }
}


const register_get = (req, res) =>{
    res.render('register', {
        message : null
    });
    res.end();
}

const login_post = (req, res) =>{
    res.render('login');
    res.end();
}

const login_get = (req, res) =>{

    if (req.cookies !== null) {
        jwt.verify(req.cookies.webToken, "secret123", (err, decoded) => {
            if (err) {
                console.log("Failed to decode token : "+ err);   
            } else {
                res.send(decoded);
            }
          });
    }else{
        res.send('no cookies');
    }
    res.end();
}



module.exports = {
    register_post,
    register_get,
    login_get,
    login_post,
}