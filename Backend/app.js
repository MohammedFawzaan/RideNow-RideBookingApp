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
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes'); // import ride routes

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // middlewares
app.use(cookieParser()); // cookie parser middleware

app.get('/', (req, res) => {
    res.send("Hello");
}); // home route

app.use('/users', userRoutes); // middleware for user route
app.use('/captains', captainRoutes); // middleware for captain route
app.use('/maps', mapsRoutes); // middleware for maps route 
app.use('/rides', rideRoutes); // middleware for ride route

module.exports = app;