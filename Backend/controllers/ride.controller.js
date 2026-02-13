const rideModel = require('../models/ride.model');
const rideService = require('../services/ride.service');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId, io } = require('../socket');

// Creating a new ride when user requests it and sending it to captains nearby.
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Getting the pickup, destination, and vehicle type from the request body.
    const { pickup, destination, vehicleType } = req.body;
    if (!pickup || !destination || !vehicleType) {
        return res.status(400).json({ error: 'User, pickup, destination, and vehicle type are required' });
    }
    try {
        // Check if user already has an active ride
        const existingRide = await rideModel.findOne({
            user: req.user._id,
            status: { $in: ['pending', 'accepted', 'ongoing'] }
        });

        if (existingRide) {
            return res.status(400).json({
                error: 'You already have an active ride',
                ride: existingRide
            });
        }

        // Creating a new ride using the ride service.
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });
        res.status(201).json(ride);

        // Getting the coordinates of the pickup location using the map service.
        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);

        // Finding the Captains in the radius of 10 km from the pickup location.
        const captainsInTheRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.ltd,
            pickupCoordinates.lng,
            10 // 10 km radius
        );
        // Emptying OTP field in the ride object.
        ride.otp = "";

        // Getting the ride details for sending it to captains in the radius.
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // Mapping through the captains and sending them the ride details.
        captainsInTheRadius.map((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get the current active ride for user or captain
module.exports.getCurrentRide = async (req, res) => {
    try {
        let query = { status: { $in: ['pending', 'accepted', 'ongoing'] } };

        if (req.user) {
            query.user = req.user._id;
        } else if (req.captain) {
            query.captain = req.captain._id;
        } else {
            return res.status(400).json({ error: 'User or Captain authentication required' });
        }

        const ride = await rideModel.findOne(query)
            .populate('user')
            .populate('captain')
            .sort({ createdAt: -1 }); // Get the most recent one just in case

        if (!ride) {
            return res.status(200).json(null);
        }

        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Getting the fare estimate based on the pickup and destination locations.
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Getting the pickup and destination locations from the request query.
    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Confirming the ride when captain accepts it and assigning the captain to it.
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    try {
        // Attempt atomic update inside service
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });
        if (!ride) {
            return res.status(400).json({ error: 'Ride is already accepted by another captain' });
        }
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        // NOTIFY OTHER CAPTAINS TO CLEAR THE POPUP
        try {
            const pickupCoordinates = await mapService.getAddressCoordinates(ride.pickup);
            const captainsInRadius = await mapService.getCaptainsInTheRadius(
                pickupCoordinates.ltd,
                pickupCoordinates.lng,
                10 // same radius as createRide
            );

            captainsInRadius.forEach(captain => {
                if (captain._id.toString() !== req.captain._id.toString()) {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'ride-taken',
                        data: { rideId: ride._id }
                    });
                }
            });
        } catch (err) {
            console.error("Error notifying other captains:", err);
        }

        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Starting the ride when captain starts it and send the OTP to the user.
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Getting the ride ID and OTP from the request query.
    const { rideId, otp } = req.query;
    try {
        // To get the ride details and start the ride, we are sending rideId, otp and captain to startRide service.
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }
        // sending the ride details to the user.
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });
        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Ending the ride when captain ends it and sending the ride details to the user.
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Getting the ride ID from the request body.
    const { rideId } = req.body;
    try {
        // To get the ride details and end the ride, we are sending rideId and captain to endRide service.
        const ride = await rideService.endRide({ rideId, captain: req.captain });
        // Sending the ride details to the user.
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Getting the ride ID from the request body.
    const { rideId } = req.body;
    console.log(`Received Cancel Request for rideId: ${rideId}`);
    try {
        // Cancel the ride using ride service.
        const ride = await rideService.cancelRide({ rideId });
        console.log(`Ride ${rideId} successfully cancelled in DB.`);
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        // 1. BROADCAST to the ride room (Reliable for both User and Assigned Captain who are in the room)
        sendMessageToSocketId(ride._id.toString(), {
            event: 'ride-cancelled',
            data: ride
        });

        // 2. ALSO notify User specifically in case they aren't in the room (e.g. from Home page)
        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-cancelled',
                data: ride
            });
        }

        // 3. SPECIAL CASE: If no captain was assigned yet, notify nearby captains to clear popups
        if (!ride.captain) {
            try {
                const pickupCoordinates = await mapService.getAddressCoordinates(ride.pickup);
                const captainsInRadius = await mapService.getCaptainsInTheRadius(
                    pickupCoordinates.ltd,
                    pickupCoordinates.lng,
                    10
                );
                captainsInRadius.forEach(captain => {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'ride-cancelled',
                        data: ride
                    });
                });
            } catch (err) {
                console.error("Error notifying nearby captains of cancellation:", err);
            }
        }
        // 4. ALSO notify Assigned Captain specifically if one exists (fallback if room broadcast fails)
        else if (ride.captain && ride.captain.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: 'ride-cancelled',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}