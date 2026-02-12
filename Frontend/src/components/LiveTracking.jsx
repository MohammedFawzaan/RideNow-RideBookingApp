import React, { useState, useEffect, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  // Load initial location + enable watch mode
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    // Initial location fetch
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log("Error initial:", err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Continuous real-time tracking
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log("Error watch:", err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Recenter Button Function
  const recenterToUser = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.panTo(currentPosition);
      mapRef.current.setZoom(16);
    }
  };

  const onLoad = (map) => {
    mapRef.current = map;
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onError={() => setMapError(true)}
      >
        {mapError ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-red-600 font-semibold p-4 text-center">
            Failed to load Google Maps. Please check your network connection or API Key.
          </div>
        ) : currentPosition ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={16}
            onLoad={onLoad}
          >
            <Marker position={currentPosition} />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-600 font-medium">
            Fetching your location...
          </div>
        )}
      </LoadScript>

      {/* Recenter Button */}
      <button
        onClick={recenterToUser}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "20px",
          padding: "10px 14px",
          background: "#000",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}>
        Recenter
      </button>
    </div>
  );
};

export default LiveTracking;