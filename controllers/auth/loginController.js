const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const { getUser, setRefreshToken, getRefreshToken } = require('../../dao/userDao');
const {createRefreshToken, createAccesToken} = require('./token');


const login_post = async (req, res) =>{
    const {email ,password} = req.body;
        if (email && password) {
            try {
                const [userData] = await getUser(email); 

                userData ? handleLogin(userData,password,res) :
                    res.status(409).json({
                        result:{ 
                            success : false,
                            message: "User not found!",
                            redirectPage : null,
                            error : true
                        }
                    });

            } catch (error) {
                res.status(500).json({
                    result: { 
                        success : false,
                        message: 'Internal server error',
                        redirectPage : null,
                        error : null
                    }
                });
            }
        }else{
            res.status(400).json({
                    result: { 
                    success : false,
                    message: "Please provide email and password!",
                    redirectPage : null,
                    error : null
                }});
        }
}

const handleLogin = async (userData, password, res) =>{
    try {
        const {auth_string, id, email} = userData;
        const isValid = await bcrypt.compare(password, auth_string);
        if (isValid) {

            const accessToken = createAccesToken(id);
            const refreshToken = createRefreshToken(email);
            setRefreshToken(id,refreshToken);

            res.cookie("refreshToken",
            refreshToken,{ httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.cookie("accessToken",
            accessToken,{ httpOnly: true, secure: true, sameSite: 'None', maxAge: 20 * 1000 });

            res.status(200).json({
                result:{
                    success : true,
                    message : 'Login success',
                    redirectPage : '/pages/home',
                    error : null
                }
            });

        }else{
            res.status(401).json({
                result:{ 
                    success : false,
                    message: 'Password is invalid!',
                    redirectPage : '/auth/login',
                    error : true
                }
            })
        }

    } catch (err) {
        res.status(500).json(
            { 
                success : false,
                message: 'Internal server error',
                redirectPage : null,
                error : true
            });
    }
}

const login_get = async (req, res) =>{
    
    res.status(200).json({
            success : true,
            message : 'Login loaded',
            redirectPage : '/auth/login',
            error : false
    });
}

module.exports = {
    login_get,
    login_post,
}
