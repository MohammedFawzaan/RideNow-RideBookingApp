const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    try {
        const coordinates = await mapsService.getAddressCoordinates(address);
        return res.status(200).json(coordinates);
    } catch (error) {
        return res.status(404).json({ error: 'coordinates not found' });
    }
};

module.exports.getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }
        const distanceTime = await mapsService.getDistanceAndTime(origin, destination);
        return res.status(200).json(distanceTime);
    } catch (error) {
        return res.status(404).json({ error: 'Distance and time not found' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }
        const suggestions = await mapsService.getAutoCompleteSuggestions(input);
        return res.status(200).json(suggestions);
    } catch (error) {
        return res.status(404).json({ error: 'Suggestions not found' });
    }
}