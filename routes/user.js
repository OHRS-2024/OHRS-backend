const router  = require('express').Router();
const verifyRoles = require('../middlewares/auth/verifyRoles');
const ROLES_LIST = require('../config/ROLES');
const userController = require('../controllers/account/userController');

router.delete('/remove/:id', verifyRoles(ROLES_LIST.ADMIN),userController.removeUser);
router.get('/show/:page',verifyRoles(ROLES_LIST.ADMIN),userController.getPageUser );
router.get('/get/:id', userController.getUser );
router.put('/suspend/:id',verifyRoles(ROLES_LIST.ADMIN),userController.suspendUser );
router.put('/activate/:id',verifyRoles(ROLES_LIST.ADMIN),userController.activateUser );

module.exports = router;