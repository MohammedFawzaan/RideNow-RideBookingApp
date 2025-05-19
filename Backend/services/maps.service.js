const axios = require('axios');
const captainModel = require('../models/captain.model');

// Function to get coordinates (latitude and longitude) from an address using Google Maps Geocoding API.
module.exports.getAddressCoordinates = async (address) => {
    try {
        // Google Maps API Key.
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            throw new Error('Google Maps API key is not set in environment variables.');
        }
        // Constructing the URL for the Geocoding API request.
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        // Generating the response from the API.
        const response = await axios.get(url);
        const data = response.data;

        // If the response status is OK.
        if (data.status === 'OK') {
            // Extract the Location from the response.
            const location = data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng,
            };
        } else {
            throw new Error(`Geocoding failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error;
    }
}

// Function to get distance and time between two locations using Google Maps Distance Matrix API.
module.exports.getDistanceAndTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    // Google Maps API Key.
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Google Maps API key is not set in environment variables.');
    }
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        // Getting the response from the API.
        const response = await axios.get(url);
        const data = response.data;
        // ZERO_RESULTS means no route found between origin and destination.
        if (data.rows[0].elements[0].status === 'ZERO_RESULTS') {
            throw new Error('No route found between the origin and destination.');
        }
        // If the response status is OK.
        if (data.status === 'OK') {
            // Extracting the distance and duration from the response.
            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
                return element;
            } else {
                throw new Error(`Distance and time calculation failed: ${element.status}`);
            }
        } else {
            throw new Error(`Distance Matrix API request failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw error;
    }
}

// Function to get autocomplete suggestions for a given input using Google Maps Places API.
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }
    // Google Maps API Key.
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Google Maps API key is not set in environment variables.');
    }
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        // Getting the response from the API.
        const response = await axios.get(url);
        const data = response.data;

        // If the response status is OK.
        if (data.status === 'OK') {
            // Extracting the predictions from the response.
            // Which is an Array of Location objects suggested by the API on the basis of the input.
            return data.predictions;
        } else {
            throw new Error(`Autocomplete request failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw error;
    }
};

// Function to get all captains within a specified radius from a given location.
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ] // Radius in kilometers
            }
        }
    });
    return captains;
}