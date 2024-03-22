const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).send('invalid access token'); //invalid token
            req.userId = decoded.email;
            req.userRole = decoded.userRole;
            next();
        }
    );
}

module.exports = verifyAccessToken;