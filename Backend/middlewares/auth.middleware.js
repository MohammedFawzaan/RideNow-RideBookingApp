const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]); // get token from header or cookie

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token : token }); // check if token is blacklisted
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
        const user = await userModel.findById(decoded.id); // find user by id

        req.user = user; // set user in request

        return next(); // call next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]); // get token from cookie or header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, Token Missing' });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token: token }); // check if token is blacklisted
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized, Token Blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
        const captain = await captainModel.findById(decoded._id); // find captain by id

        req.captain = captain; // set captain in request

        return next(); // call next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, Token Verification Failed' });
    }
};