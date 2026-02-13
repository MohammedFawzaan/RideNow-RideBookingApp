const cron = require('node-cron');
const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');

module.exports.startCronJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            // Using 1 minute as per user request
            const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

            // Find rides that are pending and created more than 1 minute ago
            const staleRides = await rideModel.find({
                status: 'pending',
                updatedAt: { $lt: oneMinuteAgo }
            }).populate('user');

            if (staleRides.length > 0) {
                console.log(`Found ${staleRides.length} stale rides. Cancelling...`);

                for (const ride of staleRides) {
                    ride.status = 'cancelled';
                    await ride.save();
                    console.log(`Ride ${ride._id} auto-cancelled due to timeout.`);

                    // 1. Notify User (with reason)
                    if (ride.user && ride.user.socketId) {
                        sendMessageToSocketId(ride.user.socketId, {
                            event: 'ride-cancelled',
                            data: { ...ride.toObject(), reason: 'timeout' }
                        });
                    }

                    // 2. Notify Nearby Captains to clear popup
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
                                data: { ...ride.toObject(), reason: 'timeout' }
                            });
                        });
                    } catch (err) {
                        console.error("Error notifying captains of auto-cancel:", err);
                    }
                }
            }
        } catch (error) {
            console.error('Error in auto-cancel cron job:', error);
        }
    });

    console.log('Cron jobs started: Auto-cancel pending rides > 1 min.');
};
