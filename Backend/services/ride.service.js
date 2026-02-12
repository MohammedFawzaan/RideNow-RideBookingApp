const rideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
const mapsService = require('./maps.service');
const crypto = require('crypto');

// Function to calculate fare based on distance and time.
async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }
    // Get coordinates for pickup and destination so that fare can be calculated.
    const distanceTime = await mapsService.getDistanceAndTime(pickup, destination);

    // Example fare calculation logic (values can be adjusted)
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };
    const perMinuteRate = {
        auto: 1,
        car: 2,
        moto: 0.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;
}
module.exports.getFare = getFare;

// Function to generate a random OTP of specified length.
function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

// Function to create a new ride.
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('User, pickup, destination, and vehicle type are required');
    }
    // Getting fare amount based on distance and time.
    const fare = await getFare(pickup, destination);

    // Creating a new ride in the database.
    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
        status: 'pending'
    });
    return ride;
};

// Function to confirm a ride and assign a captain to it.
module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }
    // Atomically update the ride only if it's still pending
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'pending' },  // Only update if pending
        {
            status: 'accepted',
            captain: captain._id
        },
        {
            new: true // return the updated ride
        }
    ).populate('user').populate('captain').select('+otp');
    return ride; // will be null if already accepted or not found
};

// Function to start a ride and updating the status to accepted.
module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }
    // Finding the ride.
    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }
    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    // Updating the ride status to 'ongoing'.
    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

    return ride;
}

// Function to end a ride and updating the status to completed.
module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    // finding the ride.
    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }
    // Updating the ride status to 'completed'.
    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'completed' });

    return ride;
}

module.exports.cancelRide = async ({ rideId }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    const ride = await rideModel.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }
    // Updating the ride status to 'cancelled'.
    const cancelledRide = await rideModel.findByIdAndUpdate(rideId, { status: 'cancelled' }, { new: true })
        .populate('user')
        .populate('captain');

    return cancelledRide;
}