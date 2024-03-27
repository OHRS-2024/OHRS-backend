const router  = require('express').Router();
const verifyRoles = require('../middlewares/auth/verifyRoles');
const ROLES_LIST = require('../config/ROLES');
const uploadController = require('../controllers/property/uploadsController');
const propertyController = require('../controllers/property/propertyController');

router.post('/add', verifyRoles(ROLES_LIST.LANDLORD),propertyController.addProperty);

router.put('/modify/:id', verifyRoles(ROLES_LIST.LANDLORD), propertyController.modifyProperty);

router.get('/show',verifyRoles(ROLES_LIST.LANDLORD),propertyController.getAllProperties );
router.get('/get/:id', verifyRoles(ROLES_LIST.LANDLORD),propertyController.getProperty );
router.delete('/remove/:id',verifyRoles(ROLES_LIST.LANDLORD), propertyController.removeProperty );
router.get('/uploads/:id' ,uploadController.getUploads);

module.exports = router;