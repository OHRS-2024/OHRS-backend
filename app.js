require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/auth/credentials');
const verifyAccessToken = require('./middlewares/auth/verifyAccessToken');
const PORT = process.env.PORT || 4000;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/', require('./routes/auth/root'));
app.use('/auth', require('./routes/auth/authRoute'));

app.use(verifyAccessToken);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send("404 Not Found");
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () =>{ 
    console.log("SERVER RUNNIG AT PORT : " + PORT); 
});