const { getRefreshToken, deleteRefreshToken } = require('../../dao/userDao');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies?.refreshToken && !req?.userId) return res.sendStatus(204); //No content
    
    const cookieRefreshToken = cookies.refreshToken;
    const userId  = req?.userId;

    // Is refreshToken in db?
    const refreshTokens = await getRefreshToken(userId);

    if (refreshTokens?.length < 1) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    const foundToken = refreshTokens.find(token => token.refreshToken === cookieRefreshToken);
    const result = await deleteRefreshToken(foundToken.id);
    console.log(result);

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }