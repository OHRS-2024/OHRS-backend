const listingData = require("../../dataAccessModule/listingData");
const sendErrorResponse = require("../../utils/sendErrorResponse");
const getDate = require("../../utils/date");

const createListing = async (req, res) => {
  if (!req?.body?.listingId || 
      !req?.body?.title || 
      !req?.body?.description || 
      !req?.body?.pricePerDay || 
      !req?.body?.stays) {
      return sendErrorResponse(res, 400, "Incomplete information", "");
  }

  const { listingId, title, description, pricePerDay, stays } =
    req?.body;

  const listingDate = getDate();

  try {
    const result = await listingData.createListing(
      listingId,
      listingDate,
      title,
      description,
      pricePerDay,
      stays
    );

    if (result.affectedRows < 1) {
     return sendErrorResponse(res, 409, "Something went wrong!", "");
    }
    return res.status(200).json({
      result: {
        success: true,
        message: "Successfully created a listing!",
        error: null,
      },
    });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, 500, "Intenal server error!", "");
  }
};

const removeListing = async (req, res) => {
  try {
    const listingId = req?.params?.id;
    if (!listingId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await listingData.removeListing(listingId);
    if (result.affectedRows > 0) {
      return res.status(200).json({
        result: {
          success: true,
          message: "successfully deleted the property!",
          error: null,
        },
      });
    }
    return sendErrorResponse(res, 409, "Unable to remove the listing!", "");
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const getPageListing = async (req, res) => {
  try {
    const page = req?.params?.page;
    if (!page) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await listingData.getPageListing(page);
    if (!result) {
      return sendErrorResponse(
        res,
        404,
        "Not found, unable to show the listings!",
        ""
      );
    }
    return res.status(200).json({
      result: {
        success: true,
        message: `successfully loaded page ${page} listings!`,
        error: null,
        body: result,
      },
    });
  } catch (error) {
    
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const getListing = async (req, res) => {
  try {
    const listingId = req?.params?.id;

    if (!listingId) {
      return sendErrorResponse(res, 400, "Incomplete information!", "");
    }

    const result = await listingData.getListing(listingId);
    if (result[0]) {
      await listingData.viewListing(listingId);
      return res.status(200).json({
        result: {
          success: true,
          message: "successfully retrieved the listing!",
          error: null,
          body: result[0],
        },
      });
    } else {
      return res.status(200).json({
        result: {
          success: false,
          message: "No results found!",
          error: null,
          body: null,
        },
      });
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error!", "");
  }
};

const reportListing = async (req, res) => {
  const { userId, listingId, reportBody } = req?.body?.report;
  if (!userId || !listingId || !reportBody) {
    return sendErrorResponse(res, 400, "Incomplete information!", "");
  }
  const reportDate = getDate();
  try {
    const result = await listingData.reportListing(
      userId,
      listingId,
      reportDate,
      reportBody
    );
    if (result.affectedRows < 1) {
      return sendErrorResponse(res, 409, "Something went wrong!", "");
    }
    return res.status(200).json({
      result: {
        success: true,
        message: "Successfully made a report!",
        error: null,
      },
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Intenal server error!", "");
  }
};

module.exports = {
  createListing,
  removeListing,
  getPageListing,
  getListing,
  reportListing,
};
