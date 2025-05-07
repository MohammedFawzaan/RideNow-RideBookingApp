import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css'
import UberHome from '../assets/UberHome.jpeg'
import LogoImage from '../assets/logo.png'
import LocationPanel from '../components/LocationPanel';

const Home = () => {
  const [pickup, setPickup] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [panelOpen, setPanelOpen] = React.useState(false);
  const panelRef = React.useRef(null)
  const panelCloseRef = React.useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
        // opacity:1
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
        // opacity:0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' alt="temporary-image" />
      </div>
      <div className='h-screen flex flex-col justify-end absolute top-0 w-full'>
        <div className='h-[30%] p-5 bg-white relative'>
          <h5 
            ref={panelCloseRef} 
            onClick={() => { setPanelOpen(false) }} 
            className='absolute opacity-0 top-4 right-6 text-2xl'
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-bold'>Find Your Trip</h4>
          <form onSubmit={(e) => handleSubmit(e)}>
            {/* <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div> */}
            <input
              onClick={() => { setPanelOpen(true) }} 
              value={pickup} 
              onChange={(e) => { setPickup(e.target.value) }} 
              className='bg-[#eee] m-2 px-8 py-2 text-base rounded-lg w-full' 
              type="text" 
              placeholder='add a pickup location'
            />
            <input 
              onClick={() => { setPanelOpen(true) }} 
              value={destination} onChange={(e) => { setDestination(e.target.value) }}
              className='bg-[#eee] m-2 px-8 py-2 text-base rounded-lg w-full' 
              type="text" 
              placeholder='enter your destination'
            />
          </form>
        </div>
        <div ref={panelRef} className='bg-white h-0'>
          <LocationPanel />
        </div>
      </div>
    </div>
  )
}

export default Home