import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PickupNavigation from '../components/PickupNavigation';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import DraggablePanel from '../components/DraggablePanel';

const CaptainPickup = () => {
  const location = useLocation();
  const rideData = location.state?.ride;

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = React.useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);

  const [driverDistance, setDriverDistance] = useState(null);

  const handleDriverLocationUpdate = async (captainLocation) => {
    if (!captainLocation || !rideData?.pickup) return;

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
  }, []);

  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      transform: confirmRidePopUpPanel ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [confirmRidePopUpPanel]);

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