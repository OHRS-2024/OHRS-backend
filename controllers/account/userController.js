const userData = require("../../dataAccessModule/userData");
const sendErrorResponse = require("../../utils/sendErrorResponse");
const STATUS = require("../../config/STATUS");

const removeUser = async (req, res) => {
  try {
    const userId = req?.params?.id;
    if (!userId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await userData.deleteUser(userId);
    console.log(userId);
    console.log(result);
    if (result.affectedRows > 0) {
      return res.status(200).json({
        result: {
          success: true,
          message: `successfully deleted user : ${userId}`,
          error: null,
        },
      });
    }
    return sendErrorResponse(res, 409, "Unable to remove user", "");
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const getPageUser = async (req, res) => {
  try {
    const page = req?.params?.page;
    if (!page) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await userData.getPageUser(page);
    if (!result) {
      return sendErrorResponse(
        res,
        404,
        "Not found, unable to show users!",
        ""
      );
    }
    return res.status(200).json({
      result: {
        success: true,
        message: `successfully loaded page ${page} users!`,
        error: null,
        body: result,
      },
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const userRole = req.userRole;

    if (!userId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = userRole === 3000 ? await userData.getUser(userId) : 
    await userData.getUserInfo(userId);

    if (result) {
      return res.status(200).json({
        result: {
          success: true,
          message: `successfully retrieved user : ${userId}`,
          error: null,
          body: result,
        },
      });
    } else {
      return res.status(200).json({
        result: {
          success: false,
          message: `No users found with ${userId} id!`,
          error: null,
          body: result,
        },
      });
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const suspendUser = async (req, res) => {
  try {
    const userId = req?.params?.id;

    if (!userId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await userData.changeUserStatus(userId, STATUS.SUSPENDED);
    if (result.affectedRows < 1) {
      return res.status(200).json({
        result: {
          success: false,
          message: `No users found with ${userId} id!`,
          error: null,
          body: result,
        },
      });
    } else {
      return res.status(200).json({
        result: {
          success: true,
          message: `successfully suspended user : ${userId}`,
          error: null,
          body: result,
        },
      });
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const activateUser = async (req, res) => {
  try {
    const userId = req?.params?.id;

    if (!userId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await userData.changeUserStatus(userId, STATUS.ACTIVE);
    if (result.affectedRows < 1) {
      return res.status(200).json({
        result: {
          success: false,
          message: `No users found with ${userId} id`,
          error: null,
          body: result,
        },
      });
    } else {
      return res.status(200).json({
        result: {
          success: true,
          message: `successfully activated user : ${userId}`,
          error: null,
          body: result,
        },
      });
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

module.exports = {
  getPageUser,
  getUser,
  suspendUser,
  removeUser,
  activateUser,
};
