const dotenv = require('dotenv'); 
dotenv.config(); //configure dotenv
const cors = require('cors');
const express = require('express');
const app = express(); // create express app
const connectToDB = require('./db/db');

connectToDB(); // connectToDB() 

const userRoutes = require('./routes/user.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // middlewares


app.get('/', (req, res) => {
    res.send("Hello");
}); // home route

app.use('/users', userRoutes); // middleware for route

module.exports = app;