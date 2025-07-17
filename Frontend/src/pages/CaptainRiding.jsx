import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import RideNowIcon from '../assets/RideNowIcon.png';
import { useGSAP } from '@gsap/react';
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import RouteMap from '../components/RouteMap';
import axios from 'axios';

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const [riding, setRiding] = useState(null);

  const location = useLocation();
  const rideData = location.state?.ride;

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

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)',
    });
  }, [finishRidePanel]);

  return (
    <div className='h-screen relative overflow-hidden'>
      <div className='p-3 absolute top-0 flex items-center justify-between w-screen'>
        <img className='w-32 absolute top-5 left-5' src={RideNowIcon} alt="uber-logo" />
        <Link to='/captain-home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-[90%]'>
        <RouteMap
          pickup={rideData.pickup}
          destination={rideData.destination}
          onDriverLocationUpdate={handleDriverLocationUpdate}
        />
      </div>

      <div className='h-[10%] p-5 bg-yellow-400 flex items-center justify-between'>
        <div className='flex items-center justify-center'>
          <i className="mr-2 ri-map-pin-line"></i>
          <h4 className='text-2xl font-semibold'>
            Arrival in {riding?.time || '-'}
          </h4>
        </div>
        <h4 className='text-2xl font-semibold'>
          {riding?.distance || '-'} Away
        </h4>
        <button
          onClick={() => setFinishRidePanel(true)}
          className='block m-3 text-white bg-green-400 active:bg-green-600 font-semibold p-3 rounded-lg'>
          Complete Ride
        </button>
      </div>

      <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;