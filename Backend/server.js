const app = require('./app');
const http = require('http'); // server on http
const { initializeSocket } = require('./socket'); // initializeSocket
const { startCronJobs } = require('./services/cron.service');
const port = process.env.PORT;

const server = http.createServer(app); // creating http server with app

initializeSocket(server); // initialize socket.io with the server
startCronJobs(); // start cron jobs

server.listen(port, (req, res) => {
    console.log(`Server Listening to ${port}`);
}); // server listening to port