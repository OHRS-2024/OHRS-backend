const { getPropertyMediaFiles } = require("./mediaFiles");
const sendErrorResponse = require("../../utils/sendErrorResponse");
const getUploads = async (req, res) => {
  const propertyId = req.params.id;
  const propertyMediaFiles = getPropertyMediaFiles(propertyId);
  if (!propertyMediaFiles) {
    return sendErrorResponse(res, 500, "Unable to load files!", null);
  }
  return res.status(200).send({ propertyMediaFiles });
};

module.exports = { getUploads };
