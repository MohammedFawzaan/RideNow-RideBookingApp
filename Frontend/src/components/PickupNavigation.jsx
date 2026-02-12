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

const PickupNavigation = ({ pickupLocation, captainLiveLocation, onDriverLocationUpdate }) => {
    const [captainLocation, setCaptainLocation] = useState(null);
    const [mapError, setMapError] = useState(false);
    const [directions, setDirections] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const mapRef = useRef(null);
    const lastRouteUpdate = useRef(0);

    // Avoid unnecessary re-renders by memoizing
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Geocode pickupLocation
    useEffect(() => {
        if (!scriptLoaded || !pickupLocation) return;

        if (typeof pickupLocation === 'string') {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: pickupLocation }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    setPickupCoords({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error('Geocoding failed:', status);
                }
            });
        } else {
            setPickupCoords(pickupLocation);
        }
    }, [pickupLocation, scriptLoaded]);

    // Unified handler for location updates (from GPS or Socket)
    const handleLocationUpdate = (liveLocation) => {
        if (!liveLocation) return;
        setCaptainLocation(liveLocation);

        const now = Date.now();
        // Allow first call through immediately (now - 0 > 4000 is always true)
        if (pickupCoords && now - lastRouteUpdate.current > 4000) {
            lastRouteUpdate.current = now;

            // 1. Update Map Route
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: liveLocation,
                    destination: pickupCoords,
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

            // 2. Notify Parent (if it's a GPS update for Captain)
            if (onDriverLocationUpdate) {
                onDriverLocationUpdate(liveLocation);
            }
        }
    };

    // Effect for Socket-based updates (User View)
    useEffect(() => {
        if (captainLiveLocation) {
            handleLocationUpdate(captainLiveLocation);
        }
    }, [captainLiveLocation, pickupCoords]);

    // Effect for GPS-based updates (Captain View)
    useEffect(() => {
        if (!scriptLoaded || captainLiveLocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleLocationUpdate({ lat: latitude, lng: longitude });
            },
            (error) => console.error('Geolocation error:', error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [pickupCoords, onDriverLocationUpdate, scriptLoaded, captainLiveLocation]);

    // Crucial: Re-trigger route calculation once coordinates are geocoded
    useEffect(() => {
        if (pickupCoords && captainLocation && !directions) {
            handleLocationUpdate(captainLocation);
        }
    }, [pickupCoords, captainLocation]);

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={() => setScriptLoaded(true)}
            onError={() => setMapError(true)}
        >
            {mapError ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 text-red-600 font-semibold p-4 text-center">
                    Failed to load Google Maps. Please check your network connection or API Key.
                </div>
            ) : pickupCoords ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={pickupCoords}
                    zoom={14}
                    onLoad={handleMapLoad}>
                    {captainLocation && <Marker position={captainLocation} label="C" />}
                    {pickupCoords && <Marker position={pickupCoords} label="P" />}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 font-medium text-gray-600">
                    Loading Map...
                </div>
            )}
        </LoadScript>
    );
};

export default PickupNavigation;