const jwt = require('jsonwebtoken');
const userDao = require('../../dao/userDao');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req?.cookies;
        if (cookies?.refreshToken){

                const cookieRefreshToken = cookies.refreshToken;
                const decodedRT = jwt.decode(cookieRefreshToken);
                const refreshTokens = await userDao.getRefreshTokenByEmail(decodedRT?.email);

                let foundToken = refreshTokens.find(token => token.refresh_token === cookieRefreshToken);

                if (!foundToken) {
                    await handleInvalidRefreshToken(res, cookieRefreshToken);
                    return;
                }else{
                    await evaluateJwt(res, cookieRefreshToken, foundToken);
                }

        }else{
            return res.status(401).send("non authorized");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error!");
    }
};

const evaluateJwt = async (res, cookieRefreshToken, foundToken) => {
    try {
        jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET, 
            
            async (err, decoded) => {
            
                if (err) {
                    await userDao.deleteRefreshToken(foundToken.id);
                    return res.status(401).send("non authorized");
                }

                const userRole = decoded.userRole;
                const userId = decoded.userId;
                
                const accessToken = jwt.sign(
                    {
                        "userId": userId,
                        "userRole": userRole
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                );
                res.status(200).json({ accessToken });
        });

    } catch (error) {
        res.status(500).send();
    }
};

const handleInvalidRefreshToken = async (res, cookieRefreshToken) => {
    try {
        res.clearCookie('refreshToken');
        return res.status(400).send("invalid Refresh token!");
    } catch (error) {
        res.status(500).send();
    }
};


module.exports = { handleRefreshToken };
