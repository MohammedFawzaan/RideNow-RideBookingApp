const mongoose = require('mongoose');

// database connection from mongoatlas - Uber-Clone(uberCluster)
async function connectToDb() {
    await mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('DB connection error:', err));
}

module.exports = connectToDb;