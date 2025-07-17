import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PickupNavigation from '../components/PickupNavigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import axios from 'axios';

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
    <div>
      <PickupNavigation
        pickupLocation={rideData.pickup}
        onDriverLocationUpdate={handleDriverLocationUpdate}
      />
      <div ref={confirmRidePopUpPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3">
        <ConfirmRidePopUp
          ride={rideData}
          driverDistance={driverDistance}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainPickup;