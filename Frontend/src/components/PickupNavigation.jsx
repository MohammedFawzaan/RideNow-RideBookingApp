import React, { useState, useEffect } from 'react';
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

const PickupNavigation = ({ pickupLocation }) => {
    const [captainLocation, setCaptainLocation] = useState(null);
    const [directions, setDirections] = useState(null);

    // Track captain's current location using geolocation
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const liveLocation = { lat: latitude, lng: longitude };
                setCaptainLocation(liveLocation);

                if (pickupLocation) {
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
    }, [pickupLocation]);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={captainLocation || pickupLocation}
                zoom={14}
            >
                {captainLocation && <Marker position={captainLocation} label="C" />}
                {pickupLocation && <Marker position={pickupLocation} label="P" />}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default PickupNavigation;