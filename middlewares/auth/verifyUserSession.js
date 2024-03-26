const jwt = require('jsonwebtoken');
const { getUserSession, deleteUserSession } = require('../../dataAccessModule/sessionData');
const sendErrorResponse = require('../../utils/sendErrorResponse');

const verifyUserSession = async (req, res, next) => {
    try {
        const cookies = req?.cookies;
        if (!cookies?.session_id){
            return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
        }

        const cookieSessionId = cookies.session_id;
        const userSession = await getUserSession(cookieSessionId);
        const foundUserSession = userSession[0];

        if (!foundUserSession) {
            res.clearCookie("session_id");
            return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
        } 

        const expiresAt = parseInt(foundUserSession.expires_at);
        const timeNow = new Date().getTime();
        const session_expired = timeNow >= expiresAt;

        if (session_expired) {
            await deleteUserSession(foundUserSession.session_id);
            res.clearCookie("session_id");
            return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
        }

        req.userId = foundUserSession.user_id;
        req.userRole = foundUserSession.user_role;
        next();

    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", "/auth/login");
    }
};

module.exports = {verifyUserSession};
