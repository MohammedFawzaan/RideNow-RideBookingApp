const axios = require('axios');

module.exports.getAddressCoordinates = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure you have set this environment variable
        if (!apiKey) {
            throw new Error('Google Maps API key is not set in environment variables.');
        }
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return {
                lat: location.lat,
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

module.exports.getDistanceAndTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure you have set this environment variable
    if (!apiKey) {
        throw new Error('Google Maps API key is not set in environment variables.');
    }
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.rows[0].elements[0].status === 'ZERO_RESULTS') {
            throw new Error('No route found between the origin and destination.');
        }
        if (data.status === 'OK') {
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

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure you have set this environment variable
    if (!apiKey) {
        throw new Error('Google Maps API key is not set in environment variables.');
    }
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            return data.predictions;
        } else {
            throw new Error(`Autocomplete request failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw error;
    }
};