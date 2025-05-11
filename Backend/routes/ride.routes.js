const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const { createRide, getFare } = require('../controllers/ride.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup location'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid dropoff location'),
    body('vehicleType').isString().isIn(['car', 'auto', 'moto']).isLength({ min: 3 }).withMessage('Invalid vehicle type'),
    createRide
);

router.get('/get-fare', 
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup location'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid dropoff location'),
    getFare,
);

module.exports = router;