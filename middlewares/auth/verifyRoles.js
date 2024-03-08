const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.userRole) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];

        const result = req.userRole.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles