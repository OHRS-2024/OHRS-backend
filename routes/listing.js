const router  = require('express').Router();
const verifyRoles = require('../middlewares/auth/verifyRoles');
const ROLES_LIST = require('../config/ROLES');
const listingController = require('../controllers/listing/listingController');
const { verifyUserSession } = require('../middlewares/auth/verifyUserSession');

router.post('/create',verifyUserSession, verifyRoles(ROLES_LIST.LANDLORD),listingController.createListing);
router.delete('/remove/:id', verifyUserSession,verifyRoles(ROLES_LIST.LANDLORD, ROLES_LIST.ADMIN),listingController.removeListing);
router.post('/report/:id', verifyUserSession,verifyRoles(ROLES_LIST.LANDLORD,ROLES_LIST.TENANT), listingController.reportListing);

router.get('/show/:page',listingController.getPageListing );
router.get('/get/:id', listingController.getListing );

module.exports = router;