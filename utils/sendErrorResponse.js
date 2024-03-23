function sendErrorResponse(res, status, message, redirectPage) {
    res.status(status).json({
        result: {
            success: false,
            error: true,
            message: message,
            redirectPage: redirectPage
        }
    });
}

module.exports = sendErrorResponse;