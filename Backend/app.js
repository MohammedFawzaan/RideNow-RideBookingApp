const dotenv = require('dotenv'); 
dotenv.config(); //configure dotenv
const cors = require('cors');
const express = require('express');
const app = express(); // create express app
const connectToDB = require('./db/db');
const cookieParser = require('cookie-parser'); // cookie parser for cookies

connectToDB(); // connectToDB() 

const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // middlewares
app.use(cookieParser()); // cookie parser middleware

app.get('/', (req, res) => {
    res.send("Hello");
}); // home route

app.use('/users', userRoutes); // middleware for route
app.use('/captains', captainRoutes); // middleware for route   

module.exports = app;