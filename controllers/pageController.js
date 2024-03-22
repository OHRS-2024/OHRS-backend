const { verifyToken } = require('../utils/token');
const SECRET_KEY = process.env.SECRET_KEY;

const get_home = async (req, res) => {        
            try{
                const [rows] = await verifyToken(req.cookies.userToken, SECRET_KEY);
                if (rows) {

                    res.status(200).json({
                        result: { 
                            error : false,
                            body: rows,
                            message : 'Welcome!'
                        }
                    });
                }   

            } catch (error) {
                res.status(500).json({
                    result: { 
                            error : true,
                            body: null,
                            message : 'Internal error please try agin later.'
                        }
                });
            }
}

module.exports = {get_home,};