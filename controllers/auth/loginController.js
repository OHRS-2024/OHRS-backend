const { getUserByEmail } = require('../../dataAccessModule/userData');
const { createUserSession } = require('../../dataAccessModule/sessionData');
const sendErrorResponse = require('../../utils/sendErrorResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login_post = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return sendErrorResponse(res, 400, "Please provide email and password!", '/auth/login');
        }
    
        const foundUser = await getUserByEmail(email);
    
        if (!foundUser) {
            return sendErrorResponse(res, 400, "User not found!", '/auth/login');
        }
    
        const match = await bcrypt.compare(password, foundUser.auth_string);
    
        if (!match) {
            return sendErrorResponse(res, 400, 'Password is invalid!', '/auth/login');
        }
    
        const userRole = foundUser?.user_role;
        const userId = foundUser?.user_id;
    
        const newAccessToken = jwt.sign(
            {
                "userId": userId,
                "userRole": userRole
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1w' });

    
        const weekMillSec = 1000 * 60 * 60 * 24 * 7;
    
        const result = await createUserSession(
            userId,
            newAccessToken,
            "" + new Date().getTime(),
            "" + (new Date().getTime() + weekMillSec)
        );
    
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: (7 * 24 * 60 * 60 * 1000) });
        res.status(200).json({
            result:{
                success : true,
                message : 'Login success',
                redirectPage : '/pages/home',
                error : null
            }
        });    
    } catch (error) {
        console.log(error);
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

module.exports = { 
    login_post,
    login_get,
};