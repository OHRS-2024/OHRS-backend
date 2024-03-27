const { createUser, createUserAuth, getUserByEmail} = require('../../dataAccessModule/userData');
const { createVerificationKey } = require('../../dataAccessModule/verificationData');
const sendErrorResponse = require('../../utils/sendErrorResponse');
const sendCodeToEmail = require('./Emailer');
const getDate = require('../../utils/date');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const register_post = async (req, res) => {
    try{
        if (!req?.body?.firstName ||
            !req?.body?.lastName ||
            !req?.body?.gender ||
            !req?.body?.email ||
            !req?.body?.phoneNumber ||
            !req?.body?.password) {
            return sendErrorResponse(res, 400, 'Please provide the required information!','/auth/register');             
        }

        const { firstName, lastName, gender, email, password, phoneNumber } = req?.body;
        const userId = crypto.randomUUID();
        const dateJoined = getDate();
        const fullName = firstName +" "+ lastName;
        const users = await getUserByEmail(email);

        if (users) {
            return sendErrorResponse(res, 400, 'User already exists with this email!','/auth/register');
        }
        const userRegRes = await createUser(userId, fullName, gender, email, phoneNumber, dateJoined);
        bcrypt.hash(password, 8, async (err, hash) => {
            const auth_string = hash;
            const userAuthRes = await createUserAuth(userId, auth_string, 1000);
            if(userRegRes.affectedRows < 1 || userAuthRes.affectedRows < 1){
                return sendErrorResponse(res, 500, 'Registration failed try agin later!','/auth/register');             
            }
        });

        const randomCode  = crypto.randomInt(999999);
        await sendVerificationCode(email, randomCode);
        await createVerificationKey(
            userId,
            randomCode,
            ""+new Date().getTime(),
            ""+(new Date().getTime() + 60000 * 5));

        return res.status(200).json({
            result: { 
                success : true,
                error : false,
                message : 'Please verify your email!',
                redirectPage : '/auth/verify'
            }
        });

    }catch(error){
        console.log(error);
        return sendErrorResponse (res, 500, 'Internal error try again!','/auth/register');
    }
}

const sendVerificationCode = async (email, randomCode) =>{
    try {
        sendCodeToEmail(email,randomCode, () =>{
        });
    } catch (error) {
        console.log(error);
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

module.exports = {
    register_post,
    register_get
}