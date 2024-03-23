const { getUserSession, deleteUserSession } = require('../../dataAccessModule/sessionData');
const jwt = require('jsonwebtoken');

const logout_get = async (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.accessToken && !req?.userId) return res.sendStatus(204); //No content
    
    const cookieAccessToken = cookies.accessToken;
    const userId  = req?.userId;

    // Is accessToken in db?
    const sessions = await getUserSession(userId);

    if (sessions?.length < 1) {
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    const foundToken = sessions.find(session => session.token === cookieAccessToken);
    const result = await deleteUserSession(foundToken.session_id);
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({
            result: {
                success: true,
                error: false,
                message: "Logged out successfully!",
                redirectPage: "/auth/login"
            }}
    );
}

module.exports = { logout_get }