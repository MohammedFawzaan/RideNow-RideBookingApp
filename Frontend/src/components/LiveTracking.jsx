import React, { useState, useEffect, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// URL for a car icon to represent nearby captains
const carIconUrl = "https://cdn-icons-png.flaticon.com/512/1048/1048313.png";

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [nearbyCaptains, setNearbyCaptains] = useState([]);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  // Fetch nearby captains from the backend
  const fetchNearbyCaptains = async (lat, lng) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-nearby-captains`, {
        params: { ltd: lat, lng: lng, radius: 2 }, // 2km radius
        headers: { Authorization: `Bearer ${token}` }
      });
      setNearbyCaptains(response.data);
    } catch (err) {
      console.error("Failed to fetch nearby captains:", err);
    }
  };

  // Load initial location + enable watch mode
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    // Initial location fetch
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
        fetchNearbyCaptains(latitude, longitude);
      },
      (err) => console.error("Error initial:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Continuous real-time tracking
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Error watching:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Set up periodic fetching of nearby captains every 10 seconds
  useEffect(() => {
    if (!currentPosition) return;

    const intervalId = setInterval(() => {
      fetchNearbyCaptains(currentPosition.lat, currentPosition.lng);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentPosition]);

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
        loadingElement={<div className="h-full w-full bg-gray-100"></div>}
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
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {/* User Location Marker */}
            <Marker
              position={currentPosition}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />

            {/* Nearby Captain Markers */}
            {nearbyCaptains.map((captain) => (
              <Marker
                key={captain._id}
                position={{ lat: captain.location.ltd, lng: captain.location.lng }}
                icon={{
                  url: carIconUrl,
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: new window.google.maps.Point(15, 15)
                }}
                title={captain.fullname.firstname}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
      </LoadScript>

      {/* Recenter Button */}
      <button
        onClick={recenterToUser}
        style={{
          position: "absolute",
          top: "120px",
          right: "20px",
          padding: "10px 14px",
          background: "#fff",
          color: "#000",
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