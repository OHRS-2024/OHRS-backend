const { getUserSession, deleteUserSession } = require('../../dataAccessModule/sessionData');

const logout_get = async (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.session_id && !req?.userId) return res.sendStatus(204); //No content
    
    const cookieSessionId = cookies.session_id;

    const result = await deleteUserSession(cookieSessionId);

    if (result.affectedRows < 1) {
        return sendErrorResponse(res, 409, "Unable to logout!", "/auth/login");
    }
    
    res.clearCookie('session_id', { httpOnly: true, sameSite: 'None', secure: true });
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