const allRoles = require('../../config/ROLES');
const sendErrorResponse = require('../../utils/sendErrorResponse');

const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.userRole) return res.status(401).send();
        const rolesArray = [...allowedRoles];
        const uRole = !Array.isArray(req.userRole) ? [req.userRole] : req.userRole;
        const result = uRole.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        if (!result) {
            return sendErrorResponse(res, 403, "Forbidden!","");
        }
        next();
    }
}

const verifyLandlord = (req, res, next) => {
        if (!req?.userRole) return res.status(401).send();
        const result = req.userRole.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        if (!result) return res.status(403).send();
        next();
}

const verifyAdmin = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.userRole) return res.status(401).send();
        const rolesArray = [...allowedRoles];
        const result = req.userRole.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        
        if (!result) return res.status(401).send();
        next();
    }
}

module.exports = verifyRoles