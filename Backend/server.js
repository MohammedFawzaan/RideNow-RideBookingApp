const http = require('http');
const app = require('./app');
const port = 3000 || process.env.PORT;

const server = http.createServer(app); // creating http server with app

server.listen(port, (req, res) => {
    console.log(`Server Listening to ${port}`);
}); // server listening to port