const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator'); // for validaton
const blacklistTokenModel = require('../models/blacklistToken.model');

// controller for registerUser.
module.exports.registerUser = async (req, res, next) => {
    // checking for errors in validaton
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // accessing details from request body
    const {fullname, password, email} = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email }); // checking if user already exists
    if(isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);
    
    // creating new user using userService.createUser()by passing arg - details
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    // generating token
    const token = user.generateAuthToken();
    res.status(201).json({ token, user }); // sending response
}

// controller for loginUser.
module.exports.loginUser = async (req, res, next) => {
    // checking for errors in validaton
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {email, password} = req.body; // accessing details from request body

    const user = await userModel.findOne({ email }).select('+password'); // finding user by email
    if(!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password); // comparing password
    if(!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken(); // generating token

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }); // setting cookie

    res.status(200).json({ token, user });
}

// controller for getUserProfile.
module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};