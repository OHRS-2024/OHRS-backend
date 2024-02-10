const {emailExists, createUser} = require('../dao/dao');
const crypto = require('crypto');

const register_post = async (req, res) => {
        
        const { firstName, lastName, email, gender, password, passwordRepeat } = req.body;
        const regErrs = await checkRegInfo({ firstName, lastName, password, passwordRepeat });
        
        try {
            const emailExistsResult = await emailExists(email);
            regErrs[2] = emailExistsResult ? 0 : 1;
        } catch (error) {
            console.error("Error checking if email exists:", error);
            regErrs[2] = 0;
        }

        if (!regErrs.some(e => e === 0)) {
            
            const uid = crypto.randomUUID();
            const fullName = `${firstName} ${lastName}`;
            try {
                const result = await createUser(uid, fullName, email, gender, password);
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        result: { 
                            error : false,
                            body: regErrs,
                            message : 'Registration successful!',
                            redirectPage : '/auth/login'
                         }
                    });
                }   
            } catch (error) {

                    res.status(500).json({
                        'result': { 
                            error : true,
                            body: regErrs,
                            message : 'Internal error please try agin later.',
                            redirectPage : null
                         }
                    });
            }
        } else {
            res.status(400).
            json({
                result: { 
                    error : true,
                    body: regErrs,
                    message : 'Please provide the required information!',
                    redirectPage : null
                 }
            });
        }
}

const checkRegInfo = async (userData) => {
    const { firstName, lastName, email, password, passwordRepeat } = userData;

        const inputErrors = [0, 0, 0, 0, 0];

        const nameRegex = /^[A-Za-z\s]+$/;
        const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*\d).{6,}$/;
    
        inputErrors[0] = nameRegex.test(firstName) ? 1 : 0;
        inputErrors[1] = nameRegex.test(lastName) ? 1 : 0;
        inputErrors[3] = passRegex.test(password) ? 1 : 0;
        inputErrors[4] = passwordRepeat === password ? 1 : 0;
    
        return inputErrors;    
}

const register_get = (req, res) =>{
    res.render('register');
    res.end();
}

module.exports = {
    register_post,
    register_get,
}