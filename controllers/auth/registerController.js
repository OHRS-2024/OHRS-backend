const {userExists, createUser} = require('../../dao/userDao');
const sendCodeToEmail = require('./Emailer');
const crypto = require('crypto');
const cache  = require('memory-cache');

let waiting = false;

const createUser_post = async (req, res) => {
        
    try{
        if (!req?.body?.firstName ||
            !req?.body?.lastName ||
            !req?.body?.gender ||
            !req?.body?.email ||
            !req?.body?.phoneNumber) {
            return sendErrorResponse(res, 400, 'Please provide the required information!','/auth/register');             
        }

        const { firstName, lastName, gender, email, phoneNumber } = req?.body;
        const uid = crypto.randomUUID();
        const dateJoined = new Date().toISOString();
        const fullName = firstName +" "+ lastName;
        const userAlreadyExists = await userExists(email);

        if (userAlreadyExists) {
            return sendErrorResponse(res, 400, 'User already exists with this email!','/auth/register');
        }
        const userData = {uid, fullName, gender, email, phoneNumber, dateJoined}
        cache.put('userData', userData);
        sendVerificationCode(email);

        return res.status(200).json({
            result: { 
                success : true,
                error : false,
                message : 'Please verify your email!',
                redirectPage : '/auth/verify'
                }
        });
    }catch(error){
        return sendErrorResponse(res, 500, 'Internal error try again!','/auth/register');
        console.log(error);
    }
}

const sendVerificationCode = async (email) =>{
    const randomCode  = crypto.randomInt(9999);
    waiting = true;
    cache.put('verificationCode',randomCode,120000);
    sendCodeToEmail(email,randomCode, () =>{
        waiting = false;
        console.log("Sending code timeout!");
    });
}



const verify_post = async (req, res)  => {
    if (!req?.body?.verificationCode) {
        return sendErrorResponse(res, 400, 'No verification code!', '/auth/verify');
    }

    if (!waiting) {
        return sendErrorResponse(res, 408, 'Could not verify try again!', '/auth/register');
    }
    const verificationCode = req.body.verificationCode;
    const sentCode = cache.get('verificationCode');

    if (sentCode != verificationCode) {
        return sendErrorResponse(res, 401, 'Code is Invalid!', '/auth/register');
    }

    try {
        const userData = cache.get('userData');
        const {uid, fullName, gender, email, phoneNumber, dateJoined} = userData;
        const result = await createUser(uid, fullName, gender, email, phoneNumber, dateJoined);
        if (result.affsectedRows > 0) {
            return res.status(200).json({
                result: { 
                    success : true,
                    error : false,
                    message : 'Registration successful!',
                    redirectPage : '/auth/login'
                    }
            });
        }   
    } catch (error) {
        return sendErrorResponse(res, 500, 'Internal error please try agin later.', '/error/server');
    }
}

const register_get = (req, res) =>{
    return res.status(200).json({
        result:{
            success : true,
            message : 'Page loaded',
            redirectPage : '/auth/register',
            error : false
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
    createUser_post,
    verify_post,
    register_get
}