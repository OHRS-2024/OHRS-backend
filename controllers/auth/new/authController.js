const { deleteRefreshToken, getRefreshTokenByEmail, getRefreshToken,getUser } = require('../../../dao/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {

    const cookies = req.cookies;
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ 'success': false, 'message': 'Username and password are required.',error : true, redirectLocation : '/auth/login' });


    const result = getRefreshTokenByEmail(email);
    const foundUser = result[1];

    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.auth_string);
    
    if (match) {
        const userRole = Object.values(foundUser.user_role).filter(Boolean);

        const accessToken = jwt.sign({
            "UserInfo": {
                "username": foundUser.email,
                "roles": userRole
            }},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20s' });

        const newRefreshToken = jwt.sign(
            { "username": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.refreshToken ? foundUser.refresh_token : foundUser.refresh_token.filter(rt => rt !== cookies.refreshToken);

        if (cookies?.refreshToken) {
            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.refreshToken;
            const foundToken = await checkRefreshToken(refreshToken);

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };