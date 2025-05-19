const dotenv = require('dotenv');  
dotenv.config(); //configure dotenv
const cors = require('cors');
const express = require('express');
const app = express(); // create express app
const connectToDB = require('./db/db'); // to connect database
const cookieParser = require('cookie-parser'); // cookie parser for cookies

connectToDB(); // connectToDB()

// Routes for the application
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

// Middleware for the application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware for routes
app.use('/users', userRoutes); // middleware for user route
app.use('/captains', captainRoutes); // middleware for captain route
app.use('/maps', mapsRoutes); // middleware for maps route 
app.use('/rides', rideRoutes); // middleware for ride route

module.exports = app;