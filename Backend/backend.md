# RideNow Backend Documentation

This documentation provides an overview of the server-side architecture, API routes, and service logic of the RideNow application.

## 🛠 Technical Features & Tech Stack
- **Node.js & Express**: High-performance runtime and framework for the REST API.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage (Users, Captains, Rides).
- **Socket.io**: Powering real-time communication for ride matching and live tracking.
- **JWT (JSON Web Token)**: Stateless authentication for secure session management.
- **Bcrypt**: Industrial-grade password hashing.
- **Google Maps API (Backend Services)**:
  - **Distance Matrix**: For server-side fare calculations based on real road distance.
  - **Geocoding**: Extracting coordinates from user-entered strings.
  - **Places API**: Providing location suggestions to the frontend.
- **Express Validator**: Middleware for rigorous input sanitization and schema validation.

---

## 🛣 API Routes

### 1. User Routes (`/users`)
- `POST /register`: Creates a new user account.
- `POST /login`: Authenticates user and returns a JWT.
- `GET /profile`: Returns authenticated user details (Protected).
- `GET /logout`: Blacklists the current token.

### 2. Captain Routes (`/captains`)
- `POST /register`: Creates a new captain account with vehicle details.
- `POST /login`: Authenticates captain and returns a JWT.
- `GET /profile`: Returns authenticated captain details (Protected).
- `GET /logout`: Blacklists the current token.

### 3. Ride Routes (`/rides`)
- `POST /create`: Passenger creates a new ride request and notifies nearby captains.
- `GET /get-fare`: Calculates price estimates for car, auto, and moto.
- `POST /confirm`: Captain accepts a pending ride.
- `GET /start-ride`: Captain starts the ride using the passenger's OTP.
- `POST /end-ride`: Captain marks the ride as completed.
- `POST /ride-cancel`: Securely cancels an active or pending ride.

### 4. Maps Routes (`/maps`)
- `GET /get-coordinates`: Proxies address lookup to Google Maps.
- `GET /get-suggestions`: Provides location search results.
- `GET /get-distance-time`: Direct server-to-server distance calculation.

---

## 📂 File Architecture

### 1. Core Logic
- **`server.js`**: The entry point. Initializes the HTTP server and attaches the Socket.io instance.
- **`app.js`**: Configures Express, mounts all routes, and handles core middleware (CORS, CookieParser).
- **`socket.js`**: The "Central Nervous System." Manages user/captain socket mapping, room joins (`rideId`), and broadcasting location updates.

### 2. Layers
- **`models/`**: Defines MongoDB schemas (`User`, `Captain`, `Ride`, `BlacklistToken`).
- **`controllers/`**: Handles the request-response cycle. Validates input and calls the appropriate service.
- **`services/`**: The core business logic. Contains complex math for fare calculation and database transactions.
- **`middlewares/`**: 
  - `authUser/authCaptain`: Verifies JWT tokens and attaches the entity to the `req` object.
  - `authAny`: Allow both Users and Captains to access shared utility routes.

---

## 🛰 Real-time Socket Events
The backend uses a specific set of events to manage the ride lifecycle:
- **`join`**: Users and Captains register their `socketId` in the database upon login.
- **`new-ride`**: Emitted to captains within a 10km radius when a user requests a ride.
- **`ride-confirmed`**: Notifies the passenger that a captain is on the way.
- **`update-ride-location`**: Receives raw GPS from the captain and broadcasts it to the passenger in the same ride room.
- **`ride-started` / `ride-ended` / `ride-cancelled`**: UI synchronization events.
