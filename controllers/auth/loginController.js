const { getUserByEmail } = require('../../dataAccessModule/userData');
const { createUserSession, getUserSession, deleteUserSession } = require('../../dataAccessModule/sessionData');
const crypto = require('crypto');
const sendErrorResponse = require('../../utils/sendErrorResponse');
const bcrypt = require('bcrypt');

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

        const sessionId = crypto.randomUUID();
        const userId = foundUser?.user_id;
        const userRole = foundUser?.user_role;
        const userAgent = req.headers['user-agent'];
        const origin = req.headers.origin || "UNDEFINED";
        const createdAt = "" + new Date().getTime();
        const dayMillSec = 1000 * 60 * 60 * 24;
        const expiresAt = "" + (new Date().getTime() + dayMillSec);

        const result = await createUserSession(sessionId,userId,userRole,userAgent,origin,createdAt,expiresAt);
        if (result.affectedRows < 1) {
            return sendErrorResponse(res, 409, 'Something went wrong!', '/auth/login');
        }

        if (req?.cookies?.session_id) {
            await handleExsistingSession(req?.cookies?.session_id);
        }

        res.cookie('session_id', sessionId, { httpOnly: true, secure: true, sameSite: 'None', maxAge: (24 * 60 * 60 * 1000) });
        res.status(200).json({
            result:{
                success : true,
                message : 'Login success',
                error : null
            }
        });    

    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", '/auth/login');   
    }
}

const handleExsistingSession  = async (sessionId) =>{
    const foundSession = await getUserSession(sessionId);
    if (foundSession[0]) {
        await deleteUserSession(sessionId);
    }
}

const login_get = (req, res) => res.status(200).send();

module.exports = { 
    login_post,
    login_get,
};