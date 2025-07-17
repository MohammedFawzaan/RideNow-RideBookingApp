import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const RouteMap = ({ pickup, destination, onDriverLocationUpdate }) => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);
    const lastRouteUpdate = useRef(0);

    // Memoized map load handler
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Watch position updates
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const liveLocation = { lat: latitude, lng: longitude };
                setCurrentPosition(liveLocation);

                // Send live location up to parent
                if (onDriverLocationUpdate) {
                    onDriverLocationUpdate(liveLocation);
                }

                // Debounce route updates
                const now = Date.now();
                if (pickup && destination && now - lastRouteUpdate.current > 4000) {
                    lastRouteUpdate.current = now;
                    const directionsService = new window.google.maps.DirectionsService();
                    directionsService.route(
                        {
                            origin: liveLocation,
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
            },
            (error) => console.error('Geolocation error:', error),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [pickup, destination, onDriverLocationUpdate]);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={pickup}
                zoom={14}
                onLoad={handleMapLoad}
            >
                {pickup && <Marker position={pickup} label="P" />}
                {destination && <Marker position={destination} label="D" />}
                {currentPosition && <Marker position={currentPosition} label="You" />}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default RouteMap;