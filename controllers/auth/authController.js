const { getUser, createRefreshToken } = require('../../dao/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login_post = async (req, res) => {
    try {
        const cookies = req.cookies;
        const { email, password } = req.body;
        
        if (!email || !password){
            return sendErrorResponse(res, 401, "Please provide email and password!", '/auth/login');
        }
    
        const foundUser = await getUser(email);
    
        if (!foundUser) {
            return sendErrorResponse(res, 401, "User not found!", '/auth/login');
        }
    
        const match = await bcrypt.compare(password, foundUser.auth_string);
    
        if (!match) {
            return sendErrorResponse(res, 401, 'Password is invalid!', '/auth/login');
        }
    
        const userRole = foundUser?.user_role;
        const userId = foundUser?.user_id;
    
        const accessToken = jwt.sign(
            {
                "userId": userId,
                "userRole": userRole
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' });
    
        const newRefreshToken = jwt.sign(
            { "email": email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1w' }
        );
    
        const weekMillSec = 1000 * 60 * 60 * 24 * 7;
    
        const result = await createRefreshToken(
            userId,
            newRefreshToken,
            "" + (new Date().getTime() + weekMillSec)
        );
    
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({
            result:{
                success : true,
                message : 'Login success',
                redirectPage : '/pages/home',
                error : null,
                accessToken : accessToken
            }
        });    
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", '/auth/login');   
    }
}

const login_get = (req, res) =>{
    res.status(200).json({
        result: {
            success: true,
            error: false,
            message: "Login page loading",
            redirectPage: "/auth/login"
        }
    });
}

function sendErrorResponse(res, status, message, redirectPage) {
    res.status(status).json({
        result: {
            success: false,
            error: true,
            message: message,
            redirectPage: redirectPage
        }
    });
}

module.exports = { 
    login_post,
    login_get,
};