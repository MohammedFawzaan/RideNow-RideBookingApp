import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    LoadScript,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100vh',
};

const PickupNavigation = ({ pickupLocation, onDriverLocationUpdate }) => {
    const [captainLocation, setCaptainLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);
    const lastRouteUpdate = useRef(0);

    // Avoid unnecessary re-renders by memoizing
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const liveLocation = { lat: latitude, lng: longitude };
                setCaptainLocation(liveLocation);

                // Sending driver live location to handleDriverLocationUpdate() in pickup component.
                onDriverLocationUpdate && onDriverLocationUpdate(liveLocation);

                // Debounce route calculation
                const now = Date.now();
                if (pickupLocation && now - lastRouteUpdate.current > 3000) {
                    lastRouteUpdate.current = now;
                    const directionsService = new window.google.maps.DirectionsService();
                    directionsService.route(
                        {
                            origin: liveLocation,
                            destination: pickupLocation,
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
    }, [pickupLocation, onDriverLocationUpdate]);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={pickupLocation} // Don’t keep changing center
                zoom={14}
                onLoad={handleMapLoad}
            >
                {captainLocation && <Marker position={captainLocation} label="C" />}
                {pickupLocation && <Marker position={pickupLocation} label="P" />}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default PickupNavigation;