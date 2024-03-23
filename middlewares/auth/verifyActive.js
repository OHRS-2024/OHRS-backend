const {getUserStatus} = require('../../dataAccessModule/userData');
const sendErrorResponse = require('../../utils/sendErrorResponse');

const verifyRoles = async (req, res, next) => {

    try {
        if (!req?.userId) return res.status(401).send();
        const userId = req?.userId;
        const result = await getUserStatus(userId);
        if (!result[0]) return sendErrorResponse(res, 500, "Internal server error!", "/auth/login");

        switch (result[0]) {
            case "INACTIVE":
                return sendErrorResponse(res, 401, "Please verify your acccount", "/auth/login");
                break;
            case "ACTIVE":
                next();
            break;
            default:
                next();
                break;
        }
    } catch (error) {
        return sendErrorResponse(res, 500, "Internal server error!", "/auth/login");
    }
}

module.exports = verifyRoles