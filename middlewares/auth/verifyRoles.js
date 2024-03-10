const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.userRole) return res.status(401).send();
        const rolesArray = [...allowedRoles];
        const result = req.userRole.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        
        if (!result) return res.status(401).send();
        next();
    }
}

module.exports = verifyRoles