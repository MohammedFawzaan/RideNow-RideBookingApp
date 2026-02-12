import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PickupNavigation from '../components/PickupNavigation';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import DraggablePanel from '../components/DraggablePanel';
import { SocketContext } from '../context/SocketContext';

const CaptainPickup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride;

  const { socket } = React.useContext(SocketContext);

  useEffect(() => {
    if (!rideData) {
      navigate('/captain-home');
      return;
    }
    socket.emit('join-ride', { rideId: rideData._id, userType: 'captain' });
  }, [rideData, navigate]);

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = React.useState(false);

  if (!rideData) return null;

  const [driverDistance, setDriverDistance] = useState(null);

  const handleDriverLocationUpdate = async (captainLocation) => {
    if (!captainLocation || !rideData?.pickup) return;

    // Send location to the ride room for the user to see
    socket.emit('update-ride-location', {
      rideId: rideData._id,
      location: captainLocation
    });

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
        params: {
          origin: `${captainLocation.lat},${captainLocation.lng}`,
          destination: rideData.pickup,
        },
      });
      setDriverDistance(res.data);
    } catch (err) {
      console.error('Failed to fetch driver distance:', err);
    }
  };

  useEffect(() => {
    setConfirmRidePopUpPanel(true);

    const handleRideCancelled = () => {
      setConfirmRidePopUpPanel(false);
      toast.info("Ride cancelled by passenger");
      navigate('/captain-home');
    };

    socket.on('ride-cancelled', handleRideCancelled);

    return () => {
      socket.off('ride-cancelled', handleRideCancelled);
    };
  }, [socket, navigate]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="h-[90%] w-full rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-gray-200 mt-4">
        <PickupNavigation
          pickupLocation={rideData.pickup}
          onDriverLocationUpdate={handleDriverLocationUpdate}
        />
      </div>
      <DraggablePanel isVisible={confirmRidePopUpPanel}>
        <ConfirmRidePopUp
          ride={rideData}
          driverDistance={driverDistance}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </DraggablePanel>
    </div>
  );
};

export default CaptainPickup;