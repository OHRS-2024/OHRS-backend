const router  = require('express').Router();
const verifyRoles = require('../middlewares/auth/verifyRoles');
const ROLES_LIST = require('../config/ROLES');
// const reservationController = require('../controllers/reservation/reservationController');

// router.get('/',verifyRoles(ROLES_LIST.LANDLORD),reservationController.showAllReservations );
// router.get('/get/:id', verifyRoles(ROLES_LIST.LANDLORD),reservationController.getReservation );
// router.post('/approve/:id',verifyRoles(ROLES_LIST.LANDLORD), reservationController.approveListingReq);
// router.post('/decline/:id', verifyRoles(ROLES_LIST.LANDLORD),reservationController.declineListingReq);

module.exports = router;