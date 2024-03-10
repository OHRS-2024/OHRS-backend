const jwt = require('jsonwebtoken');
const userDao = require('../../dao/userDao');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.refreshToken){

                const cookieRefreshToken = cookies.refreshToken;
                clearRefreshTokenCookie(res);
                const foundToken = getCurrentUserRefreshToken(req?.userId, cookieRefreshToken);

                if (!foundToken) {
                    await handleInvalidRefreshToken(res, refreshToken);
                    return;
                }else{
                    await evaluateJwt(res, cookieRefreshToken, foundToken);
                }
        }else{
            return res.status(401).send();
        }

    } catch (error) {
        console.error("Error handling refresh token:", error);
        res.sendStatus(500);
    }
};

const evaluateJwt = async (res, cookieRefreshToken, foundToken) => {
    try {
        jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET, 
            
            async (err, decoded) => {
            
                if (err) {
                    await userDao.deleteRefreshToken(foundToken.id);
                    return;
                }

                const userRole = decoded.userRole;
                const email = decoded.email;
                const userId = decoded.userId;
                
                const accessToken = jwt.sign(
                    {
                        "userId": userId,
                        "userRole": userRole
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                );

                const newRefreshToken = jwt.sign(
                    { "email": email },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1w' }
                );

                await userDao.setRefreshToken(foundToken.id, newRefreshToken);

                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error("Error evaluating JWT:", error);
        res.status(500).send();
    }
};

const handleInvalidRefreshToken = async (res, refreshToken) => {

    try {
        const decoded = jwt.decode(refreshToken);
        if (!decoded) {
            return res.status(403).send(); // Forbidden
        }else{
            const currentToken =  getCurrentUserRefreshToken(decoded.userId);
            await userDao.deleteRefreshToken(currentToken.id);
            return res.status(403).send(); // Forbidden
        }

    } catch (error) {
        console.error("Error handling invalid refresh token:", error);
        res.status(500).send();
    }
};

const getCurrentUserRefreshToken = async (userId, cookieRefreshToken) =>{
    const refreshTokens = await userDao.getRefreshToken(userId);
    const foundToken = refreshTokens.find(token => token.refreshToken === cookieRefreshToken);
    return foundToken;
}

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
};


module.exports = { handleRefreshToken };
