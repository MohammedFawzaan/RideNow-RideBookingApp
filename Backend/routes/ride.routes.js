const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { createRide, getFare, confirmRide, startRide, endRide } = require('../controllers/ride.controller');
const { authUser } = require('../middlewares/auth.middleware');
const { authCaptain } = require('../middlewares/auth.middleware');

// Route to create a ride
router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup location'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid dropoff location'),
    body('vehicleType').isString().isIn(['car', 'auto', 'moto']).isLength({ min: 3 }).withMessage('Invalid vehicle type'),
    createRide
);

// Route to get fare estimate
router.get('/get-fare', 
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup location'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid dropoff location'),
    getFare,
);

// Route to confirm a ride
router.post('/confirm', 
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    confirmRide
);

// Route to start a ride
router.get('/start-ride',
    authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride ID'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
);

// Route to end a ride
router.post('/end-ride',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    endRide
);

module.exports = router;