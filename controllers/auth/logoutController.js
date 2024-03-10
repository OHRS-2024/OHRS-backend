const dotenv = require('dotenv');
dotenv.config({path:'../../.env'});
const { findUserWithId, resetRefreshToken } = require('../../dao/userDao');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;


    // Is refreshToken in db?
    const user = await findRefreshToken(refreshToken);

    if (user?.length < 1) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    await resetRefreshToken();
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }