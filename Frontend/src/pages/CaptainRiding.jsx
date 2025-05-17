import React, { useState, useRef } from 'react'
import LogoImage from '../assets/logo.png'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'

const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  const location = useLocation();
  const rideData = location.state?.ride;

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
        <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
        <Link to='/captain-home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-[90%]'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" />
      </div>

      <div className='h-[10%] px-5 bg-yellow-400 flex items-center justify-between'>
        <div className='flex items-center justify-center'>
            <i className="mr-2 ri-map-pin-line"></i>
            <h4 className='text-xl font-semibold'>Some kms Away</h4>
        </div>
        <button onClick={ () => { setFinishRidePanel(true) } } className='mt-5 text-white bg-green-400 active:bg-green-600 font-semibold p-3 rounded-lg'>Complete Ride</button>
      </div>

      <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div >
  )
}

export default CaptainRiding