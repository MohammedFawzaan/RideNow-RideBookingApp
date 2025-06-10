const express = require('express');
const router = express.Router();
const { getCoordinates, getDistanceTime, getAutoCompleteSuggestions } = require('../controllers/map.controller');
const { authUser } = require('../middlewares/auth.middleware'); // to protect routes
const { query } = require('express-validator');
const { authCaptain } = require('../middlewares/auth.middleware'); // to protect captain routes

// Route to get coordinates from address
router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authUser,
    getCoordinates
);

// Route to get distance and time between two locations
router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    getDistanceTime
);

// Route to get autocomplete suggestions for a given input
router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authUser,
    getAutoCompleteSuggestions
);

module.exports = router;