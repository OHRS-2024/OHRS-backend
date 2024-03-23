const jwt = require('jsonwebtoken');
const {getUser} = require('../../dataAccessModule/userData');
const { getUserSession, deleteUserSession } = require('../../dataAccessModule/sessionData');
const sendErrorResponse = require('../../utils/sendErrorResponse');

const verifyUserSession = async (req, res, next) => {
    try {
        const cookies = req?.cookies;
        if (cookies?.accessToken){
            const cookieAccessToken = cookies.accessToken;
            const decodedAccessToken = jwt.decode(cookieAccessToken);
            const allUserSessions = await getUserSession(decodedAccessToken?.userId);
            let foundUserSession = allUserSessions.find(session => session.token === cookieAccessToken);
            if (!foundUserSession) {
                res.clearCookie("userSession");
                return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
            } else {
                jwt.verify(cookieAccessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                    if (err) {
                        await deleteUserSession(foundUserSession.session_id);
                        res.clearCookie("userSession");
                        return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
                    }
                    const userId = decoded.userId;
                    const foundUser = await getUser(userId);
                    if (!foundUser) {
                        return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
                    }
                    req.userId = decodedAccessToken.userId;
                    req.userRole = decodedAccessToken.userRole;
                    next();
                });
            }
        } else {
            return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
        }
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", "/auth/login");
    }
};

const evaluateToken = async (req, res, next, cookieAccessToken, foundUserSession) => {
    try {
        jwt.verify(cookieAccessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                await deleteUserSession(foundUserSession.session_id);
                res.clearCookie("userSession");
                return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
            }
            const userId = decoded.userId;
            const foundUser = await getUser(userId);
            if (!foundUser) {
                return sendErrorResponse(res, 401, "Unauthorized", "/auth/login");
            }
            req.userId = cookieAccessToken.userId;
            req.userRole = cookieAccessToken.userRole;
            next();
        });
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", "/auth/login");
    }
};

module.exports = {verifyUserSession};
