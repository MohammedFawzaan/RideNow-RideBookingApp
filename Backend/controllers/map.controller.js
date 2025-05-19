const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// Function to get coordinates (latitude and longitude) from an address using Google Maps Geocoding API.
module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // getting address from query
    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    try {
        // getting coordinates from address (ltd, lng).
        const coordinates = await mapsService.getAddressCoordinates(address);
        return res.status(200).json(coordinates);
    } catch (error) {
        return res.status(404).json({ error: 'coordinates not found' });
    }
};

// Function to get distance and time between two locations using Google Maps Distance Matrix API.
module.exports.getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // getting origin and destination from query
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }
        // getting distance and time from origin and destination
        const distanceTime = await mapsService.getDistanceAndTime(origin, destination);
        return res.status(200).json(distanceTime);
    } catch (error) {
        return res.status(404).json({ error: 'Distance and time not found' });
    }
}

// Function to get distance and time between two locations using Google Maps Places API.
module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // getting input from query
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }
        // getting suggestions from input
        const suggestions = await mapsService.getAutoCompleteSuggestions(input);
        return res.status(200).json(suggestions);
    } catch (error) {
        return res.status(404).json({ error: 'Suggestions not found' });
    }
}