import axios from 'axios';

export async function getAddressCoordinates(address) {
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