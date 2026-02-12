# RideNow Frontend Documentation

This documentation provides an overview of the frontend architecture, features, and component structure of the RideNow application.

## 🌟 General Features
- **User Authentication**: Secure sign-up and login for both Passengers and Captains.
- **Location Search**: Real-time autocomplete suggestions for pickup and destination using Google Places.
- **Fare Estimation**: Instant fare calculation based on distance and vehicle type (Car, Auto, Moto).
- **Real-time Ride Request**: Passengers can request rides, and nearby online Captains receive instant notifications.
- **Live Tracking**: Real-time GPS tracking of the Captain moving towards the passenger and during the trip.
- **OTP Verification**: Secure ride start mechanism using a 6-digit OTP provided to the passenger.
- **Interactive Map**: High-quality map interface showing routes, markers, and live movement.
- **Responsive Design**: Premium mobile-first UI with smooth GSAP animations and draggable panels.

## 🛠 Technical Stack & Features
- **React.js**: Core framework for building the user interface.
- **GSAP (GreenSock Animation Platform)**: Powering smooth, high-performance UI transitions and draggable panels.
- **Socket.io-client**: Enabling real-time, bi-directional communication with the backend.
- **Tailwind CSS**: Utility-first CSS framework for modern, responsive styling.
- **Axios**: Promised-based HTTP client for API communication.
- **Google Maps JS API**:
  - **Geocoding**: Converting addresses to coordinates.
  - **Directions Service**: Calculating and drawing the optimal route on the map.
  - **Distance Matrix**: Getting accurate travel time and distance.
- **React Context API**: Managing global state for Users, Captains, and Socket connections.
- **React Router Dom**: Handling complex navigation flows and protected routes.

---

## 📄 Major Pages & Components

### 1. User Pages
- **`Home.jsx`**: The main entry point for passengers. It contains the location search inputs, vehicle selection, and the logic to initiate a ride request.
- **`Pickup.jsx`**: Displayed once a Captain accepts the ride. It shows the Captain's details and a live map of the Captain approaching the pickup location.
- **`Riding.jsx`**: The trip view. Shows the live progress of the vehicle moving towards the final destination.

### 2. Captain Pages
- **`CaptainHome.jsx`**: The dashboard for drivers. Captains can toggle their online status and receive "New Ride" popups matching their location.
- **`CaptainPickup.jsx`**: Navigates the Captain to the passenger's pickup spot. Includes the OTP verification interface to start the ride.
- **`CaptainRiding.jsx`**: Navigates the Captain to the destination. Includes the "Complete Ride" functionality.

### 3. Core Components
- **`RouteMap.jsx`**: A reusable map component that draws routes between two points and watches the device's live GPS position.
- **`PickupNavigation.jsx`**: Specialized map component for the pickup phase, handling both the Captain's GPS and the User's socket-based view of the Captain.
- **`LiveTracking.jsx`**: A standalone map component used on the Home screen to show the user's current location.
- **`DraggablePanel.jsx`**: A wrapper component using GSAP to create the signature "Uber-style" sliding bottom sheets.
- **`ConfirmRide.jsx` & `LookingForDriver.jsx`**: UI overlays for the ride-booking workflow.

### 4. Context & Protection
- **`SocketContext.jsx`**: Maintains a single persistent socket connection across the entire application lifecycle.
- **`UserContext.jsx` / `CaptainContext.jsx`**: Stores profile information and authentication tokens.
- **`UserProtectedWrapper.jsx` / `CaptainProtectedWrapper.jsx`**: High-order components that verify authentication and fetch profiles before allowing access to private routes.

---

## 🔄 How it Works (The Logic Flow)
1. **Requesting**: In `Home.jsx`, searching for coordinates triggers Google's Autocomplete. Selecting a vehicle calculates fare via the backend.
2. **Matching**: `createRide` emits a signal. Nearby Captains in `CaptainHome.jsx` receive a `new-ride` socket event.
3. **Tracking**: Once accepted, both parties join a "Ride Room" (named after the `rideId`). The Captain's `watchPosition` sends coordinates to this room every few seconds (throttled at 4s for performance).
4. **Navigation**: The `RouteMap` or `PickupNavigation` components receive these coordinates and update the `DirectionsRenderer` to keep the path accurate.
