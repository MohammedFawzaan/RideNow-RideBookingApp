<p align="center">
  <img src="./Frontend/src/assets/RideNowLogo.png" alt="RideNow Logo" height="120" />
</p>

<h1 align="center">RideNow – Ride Booking System (MERN + Google Maps API)</h1>

<p align="center">
  A full-stack Ride-booking application inspired by Uber. Built with the MERN stack and Google Maps APIs, RideNow enables users to book rides in real time while captains (drivers) accept and complete trips. It features live tracking & real time navigation, OTP-secured confirmations and a modern responsive UI.
</p>

<hr/>

<h2>🚀 Features</h2>

<ul>
  <li>User & Captain (Driver) authentication (with Google OAuth for users)</li>
  <li>Real-time ride requests, acceptances, and cancellations via Socket.IO</li>
  <li>Real time tracking and Route Navigation for both users and captain screens using Google Maps API</li>
  <li>Real time Distance and Time updates on location change</li>
  <li>OTP-based ride start confirmation</li>
  <li>Fare calculation based on distance and duration</li>
  <li>Ride cancellation before start (for both user and captain)</li>
  <li>Responsive, modern UI with Tailwind CSS for mobile & desktop screens with toast notifications</li>
</ul>

<hr/>

<h2>🛠 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React (Vite)</li>
  <li>Tailwind CSS</li>
  <li>@react-google-maps/api</li>
  <li>GSAP</li>
  <li>Axios, Socket.IO Client, React Toastify</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js, Express.js</li>
  <li>MongoDB (Mongoose)</li>
  <li>Socket.IO</li>
  <li>Google Maps APIs (Directions, Geocoding, Places)</li>
  <li>JWT Authentication, Google OAuth with Passport js</li>
</ul>

<hr/>

<h2>📦 Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js v18+</li>
  <li>MongoDB Atlas or local MongoDB</li>
  <li>Google Cloud Project with enabled APIs:</li>
  <ul>
    <li>Maps JavaScript API</li>
    <li>Directions API</li>
    <li>Geocoding API</li>
    <li>Places API</li>
  </ul>
</ul>

<h3>Backend Setup</h3>

<ol>
  <li><b>Install dependencies:</b></li>

  <pre><code>cd Backend
npm install</code></pre>

  <li><b>Configure environment variables:</b></li>
  <pre><code>
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
  </code></pre>

  <li><b>Run server:</b></li>
  <pre><code>npx nodemon</code></pre>
  <p>Backend runs at <code>http://localhost:3000</code></p>
</ol>

<h3>Frontend Setup</h3>

<ol>
  <li><b>Install dependencies:</b></li>
  <pre><code>cd Frontend
npm install</code></pre>

  <li><b>Configure environment variables:</b></li>
  <pre><code>
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  </code></pre>

  <li><b>Run dev server:</b></li>
  <pre><code>npm run dev</code></pre>
  <p>Frontend runs at <code>http://localhost:5173</code></p>
</ol>

<hr/>

<h2>🌐 Deployment Guide</h2>

<ul>
  <li><b>Secure API Keys:</b> Restrict keys in Google Cloud Console (HTTP referrers and IPs)</li>
  <li><b>Frontend Deployment:</b> Use Vercel, Netlify, or Firebase Hosting</li>
  <li><b>Backend Deployment:</b> Use Render, Railway, or Heroku with environment variables securely set</li>
  <li>Monitor Google Maps API usage in Cloud Console</li>
</ul>

<hr/>

<h2>📖 License</h2>
<p>This project is licensed for educational purposes only.</p>

<p align="center">
  Made with ❤️ by <b>Mohammed Fawzaan</b>
</p>
