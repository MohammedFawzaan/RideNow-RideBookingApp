import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import RideNowIcon from '../assets/RideNowIcon.png';
import { useGSAP } from '@gsap/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FinishRide from '../components/FinishRide';
import RouteMap from '../components/RouteMap';
import DraggablePanel from '../components/DraggablePanel';

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [riding, setRiding] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride;

  React.useEffect(() => {
    if (!rideData) {
      navigate('/captain-home');
    }
  }, [rideData, navigate]);

  if (!rideData) return null;

  // This is called every few seconds from RouteMap
  const handleDriverLocationUpdate = async (captainLocation) => {
    if (!captainLocation || !rideData?.destination) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
        params: {
          origin: `${captainLocation.lat},${captainLocation.lng}`,
          destination: rideData.destination,
        },
      });
      setRiding(res.data);
    } catch (err) {
      console.error('Failed to fetch ride info:', err);
    }
  };

  return (
    <div className='h-screen relative overflow-hidden'>
      <div className="h-[90%] p-3">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl">
          <RouteMap
            pickup={rideData.pickup}
            destination={rideData.destination}
            onDriverLocationUpdate={handleDriverLocationUpdate}
          />
        </div>
      </div>
      <div className="h-[10%] px-5 bg-gradient-to-r from-yellow-400 to-yellow-300 
                flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2">
          <i className="ri-map-pin-line text-2xl text-black/80"></i>
          <h4 className="text-lg font-semibold text-black">
            Arrival in <span className="font-bold">{riding?.time || '-'}</span>
          </h4>
        </div>
        <h4 className="text-lg font-semibold text-black">
          {riding?.distance || '-'} Away
        </h4>
        <button
          onClick={() => setFinishRidePanel(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-xl 
               font-semibold shadow-md active:bg-green-600">
          Complete
        </button>
      </div>

      {finishRidePanel ?
        <DraggablePanel isVisible={finishRidePanel}>
          <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
        </DraggablePanel> : null}
    </div>
  );
};

export default CaptainRiding;