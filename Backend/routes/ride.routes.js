const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { createRide, getFare, confirmRide, startRide, endRide, cancelRide } = require('../controllers/ride.controller');
const { authUser, authCaptain, authAny } = require('../middlewares/auth.middleware');

const rateLimit = require('express-rate-limit');

// Rate limiter for creating rides: 5 requests per 15 minutes
const createRideLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many rides created from this IP, please try again after 15 minutes' }
});

// Route to create a ride
router.post('/create',
    createRideLimiter,
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

// Route to cancel a ride
router.post('/ride-cancel',
    authAny,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    cancelRide
);

// Route to get current active ride
router.get('/get-current-ride',
    authAny,
    require('../controllers/ride.controller').getCurrentRide
);

module.exports = router;