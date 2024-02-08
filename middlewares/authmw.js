const logger = (req, res, next) =>{

    const method = req.method;
    const path = req.path;
    const ip = req.ip;
    
    console.log(`${method} ${res.statusCode || 404} ${path} ${ip}`);
    next();
}



module.exports = {
    logger,
}