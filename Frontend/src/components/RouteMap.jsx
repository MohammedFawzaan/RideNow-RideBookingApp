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
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const mapRef = useRef(null);
    const lastRouteUpdate = useRef(0);

    // Memoized map load handler
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Geocode pickup and destination
    useEffect(() => {
        if (!scriptLoaded) return;

        const geocoder = new window.google.maps.Geocoder();

        if (pickup && typeof pickup === 'string') {
            geocoder.geocode({ address: pickup }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    setPickupCoords({ lat: location.lat(), lng: location.lng() });
                }
            });
        } else if (pickup) {
            setPickupCoords(pickup);
        }

        if (destination && typeof destination === 'string') {
            geocoder.geocode({ address: destination }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    setDestinationCoords({ lat: location.lat(), lng: location.lng() });
                }
            });
        } else if (destination) {
            setDestinationCoords(destination);
        }
    }, [pickup, destination, scriptLoaded]);

    // Watch position updates
    useEffect(() => {
        if (!scriptLoaded) return;

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
    }, [pickup, destination, onDriverLocationUpdate, scriptLoaded]);

    return (
        <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={() => setScriptLoaded(true)}
        >
            {pickupCoords ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={pickupCoords}
                    zoom={14}
                    onLoad={handleMapLoad}
                >
                    {pickupCoords && <Marker position={pickupCoords} label="P" />}
                    {destinationCoords && <Marker position={destinationCoords} label="D" />}
                    {currentPosition && <Marker position={currentPosition} label="You" />}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <p>Loading Map...</p>
                </div>
            )}
        </LoadScript>
    );
};

export default RouteMap;