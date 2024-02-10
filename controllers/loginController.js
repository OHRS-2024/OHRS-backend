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
            try {
                const [userData] = await getUser(email);
                userData ? handleLogin(userData,password,res) : 
                res.status(400).json(
                    { 
                        success : false,
                        message: "User not found!",
                        redirectPage : null,
                        error : null
                    });
                    
            } catch (error) {
                res.status(500).json(
                    { 
                        success : false,
                        message: 'Internal server error',
                        redirectPage : null,
                        error : null
                    });
            }
        }else{
            res.status(400).json(
                { 
                    success : false,
                    message: "Please provide email and password!",
                    redirectPage : null,
                    error : null
                });
        }
}

const handleLogin = async (userData, password, res) =>{
    try {
        const {auth_string, id} = userData;

        const isValid = await bcrypt.compare(password, auth_string);

        if (isValid) {
            const userToken = createWebToken(id);

            res.cookie('userToken', userToken, {
                maxAge: (1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            }); 
            
            res.status(200).json({
                success : true,
                message : 'Login success',
                redirectPage : '/pages/home',
                error : null
            });

        }else{
            // res.status(401).redirect('/login');
            res.status(401).json({ 
                success : false,
                message: 'Password is invalid!',
                redirectPage : null,
                error : null
            })
        }

    } catch (err) {
        res.status(500).json(
            { 
                success : false,
                message: 'Internal server error',
                redirectPage : null,
                error : null
            });
    }
}

const login_get = async (req, res) =>{
    
    res.status(200).render('login');
    res.end();

}

module.exports = {
    login_get,
    login_post,
}