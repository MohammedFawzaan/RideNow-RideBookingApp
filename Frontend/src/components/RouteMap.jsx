import React, { useState, useEffect } from 'react';
import {
    LoadScript,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const RouteMap = ({ pickup, destination }) => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [directions, setDirections] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    // Live tracking
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleMapLoad = (map) => {
        setMapInstance(map);

        if (pickup && destination) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickup,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={pickup}
                zoom={14}
                onLoad={handleMapLoad}>

                {pickup && <Marker position={pickup} label="P" />}
                {destination && <Marker position={destination} label="D" />}
                {currentPosition && <Marker position={currentPosition} label="You" />}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default RouteMap;
