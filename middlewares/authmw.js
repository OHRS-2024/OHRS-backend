const logger = (req, res, next) =>{

    const method = req.method;
    const path = req.path;
    const ip = req.ip;
    
    console.log(`${method} ${res.statusCode || 404} ${path} ${ip}`);
    next();
}

const checkLoggedIn = (req, res, next) =>{

    if (req.cookies && req.cookies.userToken) {
        next();
    }else{
        res.redirect('/auth/login');
    }
}

module.exports = {
    logger,
    checkLoggedIn,
}