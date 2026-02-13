<p align="center">
  <img src="./Frontend/src/assets/RideNowLogo.png" alt="RideNow Logo" height="120" />
</p>

<h1 align="center">RideNow – Ride Booking System (MERN + Google Maps API)</h1>

<p align="center">
  A full-stack Ride-booking application inspired by Uber. Built with the MERN stack and Google Maps APIs, RideNow enables users to book rides in real time while captains (drivers) accept and complete trips. It features live tracking & real time navigation, OTP-secured confirmations and a modern responsive UI.
</p>

<hr/>

<h2>🚀 Features (Production Ready)</h2>

<ul>
  <li><b>Authentication & Security</b>
    <ul>
      <li>User & Captain (Driver) authentication (JWT + Google OAuth)</li>
      <li><b>HttpOnly Cookies</b> for secure session management (No LocalStorage)</li>
      <li><b>Helmet.js</b> Security Headers (XSS, Frameguard, etc.)</li>
      <li><b>Rate Limiting</b> on API endpoints to prevent abuse</li>
    </ul>
  </li>
  <li><b>Real-time Operations</b>
    <ul>
      <li>Real-time ride requests, acceptances, and cancellations via <b>Socket.IO</b> with resilient reconnection logic</li>
      <li>Real time tracking and Route Navigation for both users and captain screens using Google Maps API</li>
      <li>Real time Distance and Time updates on location change</li>
    </ul>
  </li>
  <li><b>Ride Logic & Automation</b>
    <ul>
      <li>OTP-based ride start confirmation</li>
      <li>Fare calculation based on distance and duration</li>
      <li><b>Auto-Cancellation</b>: Pending rides auto-cancel after 1 minute via Cron Jobs</li>
      <li>Ride cancellation before start (for both user and captain)</li>
    </ul>
  </li>
  <li><b>Monitoring & Logging</b>
    <ul>
      <li><b>Morgan</b> HTTP Request Logging</li>
      <li>Centralized error handling</li>
    </ul>
  </li>
  <li><b>UI/UX</b>
    <ul>
      <li>Responsive, modern UI with Tailwind CSS for mobile & desktop screens with toast notifications</li>
    </ul>
  </li>
</ul>

<hr/>

<h2>🛠 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React (Vite)</li>
  <li>Tailwind CSS</li>
  <li>@react-google-maps/api</li>
  <li>GSAP (Animations)</li>
  <li>Axios (Configured with credentials)</li>
  <li>Socket.IO Client, React Toastify</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js, Express.js</li>
  <li>MongoDB (Mongoose)</li>
  <li>Socket.IO</li>
  <li>Google Maps APIs (Directions, Geocoding, Places)</li>
  <li><b>Passport.js</b> (Google Strategy)</li>
  <li><b>Node-Cron</b> (Scheduled Tasks)</li>
  <li><b>Helmet</b> & <b>Express-Rate-Limit</b> (Security)</li>
  <li><b>Morgan</b> (Logging)</li>
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

  <li><b>Configure environment variables (.env):</b></li>
  <pre><code>
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CLIENT_CALLBACK=http://localhost:3000/users/auth/google/callback
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
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

  <li><b>Configure environment variables (.env):</b></li>
  <pre><code>
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  </code></pre>

  <li><b>Run dev server:</b></li>
  <pre><code>npm run dev</code></pre>
  <p>Frontend runs at <code>http://localhost:5173</code></p>
</ol>

<hr/>

<h2>🌐 Deployment Checklist</h2>

<ul>
  <li><b>Environment Variables:</b> Ensure <code>NODE_ENV=production</code> and all secrets are set.</li>
  <li><b>Secure Cookies:</b> Backend automatically sets `secure: true` for cookies in production (HTTPS required).</li>
  <li><b>CORS:</b> `FRONTEND_URL` must match your deployed frontend domain exactly.</li>
  <li><b>Google Console:</b> Add deployed domain to Authorized Origins and Callback URLs.</li>
  <li><b>MongoDB Access:</b> Whitelist your deployment server IP or allow `0.0.0.0/0`.</li>
</ul>

<hr/>

<h2>📖 License</h2>
<p>This project is licensed for educational purposes only.</p>

<p align="center">
  Made with ❤️ by <b>Mohammed Fawzaan</b>
</p>
