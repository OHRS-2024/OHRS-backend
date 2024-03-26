const propertyData = require('../../dataAccessModule/propertyData');
const {handleFileUpload,saveFileToDirectory} = require('./mediaFiles');
const sendErrorResponse = require('../../utils/sendErrorResponse');
const crypto = require('crypto');

const addProperty = async (req, res) =>{
    try {
        handleFileUpload(req, res, async (err) => {
            if(
                !req?.body?.landlordId ||
                !req?.body?.propertyLocation ||
                !req?.body?.furnished ||
                !req?.body?.toatalArea ||
                !req?.body?.numberOfBedrooms ||
                !req?.body?.numberOfBathrooms ||
                !req?.body?.numberOfKitchen ||
                !req?.body?.parkingSpaces ||
                !req?.body?.type
            ){
                return sendErrorResponse(res,400,"Incomplete information!","");
            }
        
            const {landlordId, propertyLocation, furnished, toatalArea, numberOfBedrooms, numberOfBathrooms, numberOfKitchen, parkingSpaces, type} = req?.body;

            const propertyId = crypto.randomUUID();

            if (err) {
              return sendErrorResponse(res, 400, "Incomplete information!", "");
            }

            const files = req?.files; // Access uploaded files array
            
            console.log("--------------------");
            console.log(files);
            console.log(req.body);
            console.log("--------------------");

            if (!propertyId || !files || files.length === 0) {
                
              return sendErrorResponse(res, 400, "Incomplete information!", "");
            }
      
            const uploadedFiles = [];    

            const pResult = await propertyData.addProperty(propertyId,landlordId, propertyLocation, furnished, toatalArea, numberOfBedrooms, numberOfBathrooms, numberOfKitchen, parkingSpaces, type);

            if (req?.type === ("condominium" || "apartment")) {
                await propertyData.modifyProperty(req?.body?.propertyId,
            [{"private_entrance" : req?.privateEntrance},
                {"floor_number" : req?.floorNumber},
                {"elevator" : req?.elevator},
                {"has_security" : req?.hasSecurity} ]);
            }

            if (req?.body?.amenities) {
                const aResult = await propertyData.addAmenities(propertyId, req?.body?.amenities);   
            }
      
            if (pResult.affectedRows < 1) {
              return sendErrorResponse(res, 409, "Something went wrong!", "");
            }

            for (const file of files) {
                const fileName = saveFileToDirectory(propertyId, file);
                uploadedFiles.push(fileName);
              }
      
            return res.status(200).json({
              result: {
                success: true,
                message: "Successfully added the property!",
                propertyId: propertyId,
                uploadedFiles: uploadedFiles, // Include array of uploaded file names
                error: null
              }
            });
          });
        
    } catch (error) {
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

const removeProperty = async (req, res) =>{
    try {
        const propertyId = req?.params?.id;
        if (!propertyId) {
            return sendErrorResponse(res,400,"Incomplete information!","");
        }
    
        const result = await propertyData.removeProperty(propertyId);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "successfully deleted the property!",
                    error: null
                }
            });
        }
        return sendErrorResponse(res,500,"Internal server error, unable to delete the item!","");
    } catch (error) {
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

const modifyProperty = async (req, res) =>{
    try {

        const propertyId = req?.params?.id;
        const attribute = req?.body?.attribute;
        const value = req?.body?.value;

        if (!propertyId || !value || !attribute) {
            console.log(propertyId, attribute, value);
            return sendErrorResponse(res,400,"Incomplete information!","");
        }
    
        const attrVal = {
            attribute,
            value
        }

        const result = await propertyData.modifyProperty(propertyId, [attrVal]);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "successfully updated the property!",
                    error: null
                }
            });
        }
        return sendErrorResponse(res,400,"Unable to update the item!","");
    } catch (error) {
        console.log(error);
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

const getProperty = async (req, res) =>{
    try {
        const propertyId = req?.params?.id;

        if (!propertyId) {
            return sendErrorResponse(res,400,"Incomplete information!","");
        }

        const result = await propertyData.getProperty(propertyId);    
        if (result) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "successfully retrieved the property!",
                    error: null,
                    body : result
                }
            });
        }else{
            return res.status(200).json({
                "result" : {
                    success : false,
                    message : "No results found!",
                    error: null,
                    body : null
                }
            });
        }
    } catch (error) {
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

const getAllProperties = async (req, res) =>{
    try {
        const allProperties = await propertyData.getAllProperties();
        if (!allProperties) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "No results found!",
                    error: null,
                    body : allProperties
                }
            });
        }
        return res.status(200).json({
            "result" : {
                success : true,
                message : "successfully retrieved the property!",
                error: null,
                body : allProperties
            }
        });
    } catch (error) {
        console.log(error);
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

const setAvaliable = async (req, res) =>{
    try {
        const propertyId = req?.params?.id;

        if (!propertyId) {
            return sendErrorResponse(res,400,"Incomplete information!","");
        }
    
        const result = await propertyData.setAvaliable(propertyId);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "successfully updated the property!",
                    error: null
                }
            });
        }
        return sendErrorResponse(res,400,"Unable to update the item!","");
    } catch (error) {
        return sendErrorResponse(res,500,"Internal server error!","");
    }
} 

const setUnAvaliable = async (req, res) =>{
    try {
        const propertyId = req?.params?.id;

        if (!propertyId) {
            return sendErrorResponse(res,400,"Incomplete information!","");
        }
    
        const result = await propertyData.setUnAvaliable(propertyId);
        if (result.affectedRows > 0) {
            return res.status(200).json({
                "result" : {
                    success : true,
                    message : "successfully updated the property!",
                    error: null
                }
            });
        }
        return sendErrorResponse(res,400,"Unable to update the item!","");
    } catch (error) {
        return sendErrorResponse(res,500,"Internal server error!","");
    }
}

module.exports = {addProperty,removeProperty, getAllProperties, modifyProperty, getProperty}