import React, { useState, useRef } from 'react'
import gsap from 'gsap'
import RideNowIcon from '../assets/RideNowIcon.png'
import { useGSAP } from '@gsap/react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'
import RouteMap from '../components/RouteMap'
import { useEffect } from 'react'
import axios from 'axios'

const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const [riding, setRiding] = useState(null);

  const location = useLocation();
  const rideData = location.state?.ride;

  // useEffect(() => {
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,
          {
            params: { origin: rideData.pickup, destination: rideData.destination },
          }); // adjust path
        setRiding(res.data);
      } catch (err) {
        console.error('Failed to fetch ride info:', err);
      }
    };
    fetchRideDetails();
  }, []);

  useGSAP(function () {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [finishRidePanel])

  return (
    <div className='h-screen relative overflow-hidden'>
      <div className='p-3 absolute top-0 flex items-center justify-between w-screen'>
        <img className='w-32 absolute top-5 left-5' src={RideNowIcon} alt="uber-logo" />
        <Link to='/captain-home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-[90%]'>
        {/* <LiveTracking /> */}
        <RouteMap pickup={rideData.pickup} destination={rideData.destination} />
        {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" /> */}
      </div>

      <div className='h-[10%] p-5 bg-yellow-400 flex items-center justify-between'>
        <div className='flex items-center justify-center'>
          <i className="mr-2 ri-map-pin-line"></i>
          <h4 className='text-2xl font-semibold'>Arrival in {riding?.time}</h4>
        </div>
          <h4 className='text-2xl font-semibold'>{riding?.distance} Away</h4>
        <button onClick={() => { setFinishRidePanel(true) }} className='block m-3 text-white bg-green-400 active:bg-green-600 font-semibold p-3 rounded-lg'>Complete Ride</button>
      </div>

      <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div >
  )
}

export default CaptainRiding