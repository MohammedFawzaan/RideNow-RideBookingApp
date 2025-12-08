const dotenv = require('dotenv');
dotenv.config(); //configure dotenv
const cors = require('cors');
const express = require('express');
const app = express(); // create express app
const connectToDB = require('./db/db'); // to connect database
const cookieParser = require('cookie-parser'); // cookie parser for cookies

const passport = require('passport'); // passport for authentication
const session = require('express-session'); // session for user session management
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth strategy

connectToDB(); // connectToDB()

// Routes for the application
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const userModel = require('./models/user.model');

// Middleware for the application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Creating session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/users/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
            user = await userModel.create({
                fullname: {
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                },
                email: profile.emails[0].value,
                googleId: profile.id,
                authProvider: 'google',
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user to session (Saving user data into session)
passport.serializeUser((user, done) => { done(null, user); });

// Deserialize user from session (Retrieving user data from session)
passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
});

// Middleware for routes
app.use('/users', userRoutes); // middleware for user route
app.use('/captains', captainRoutes); // middleware for captain route
app.use('/maps', mapsRoutes); // middleware for maps route 
app.use('/rides', rideRoutes); // middleware for ride route

module.exports = app;