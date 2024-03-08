const jwt = require('jsonwebtoken');
const userDao = require('../../dao/userDao');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        clearRefreshTokenCookie(res);

        const refreshTokens = await userDao.getRefreshToken(req.userId);

        // Check if the received refreshToken is among the stored refreshTokens
        const foundToken = refreshTokens.find(token => token.refreshToken === refreshToken);

        if (!foundToken) {
            await handleInvalidRefreshToken(res, refreshToken);
            return;
        }

        await evaluateJwt(res, refreshToken, foundToken);
    } catch (error) {
        console.error("Error handling refresh token:", error);
        res.sendStatus(500);
    }
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
};

const handleInvalidRefreshToken = async (res, refreshToken) => {
    try {
        const decoded = jwt.decode(refreshToken);

        if (!decoded) {
            return res.sendStatus(403); // Forbidden
        }

        await userDao.deleteRefreshToken(decoded.userId); // Delete expired refresh token

        return res.sendStatus(403); // Forbidden
    } catch (error) {
        console.error("Error handling invalid refresh token:", error);
        res.sendStatus(500);
    }
};

const evaluateJwt = async (res, refreshToken, foundToken) => {
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // Expired refresh token
                await userDao.deleteRefreshToken(decoded.userId);
                return;
            }

            const roles = Object.values(foundToken.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );

            const newRefreshToken = jwt.sign(
                { "username": decoded.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '15s' }
            );

            await userDao.setRefreshToken(foundToken.id, newRefreshToken);

            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error("Error evaluating JWT:", error);
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken };
