import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import LogoImage from '../assets/logo.png'
import LocationPanel from '../components/LocationPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import axios from 'axios'

const Home = () => {
  const [pickup, setPickup] = React.useState(''); // pickup input
  const [destination, setDestination] = React.useState(''); // destination input
  const [vehiclePanel, setVehiclePanel] = React.useState(false); // to open vehiclePanel when clicked on location
  const [confirmRidePanel, setConfirmRidePanel] = React.useState(false); // to open confirmRide panel when clicked on vehicle
  const [panelOpen, setPanelOpen] = React.useState(false); // to open Find a Trip Panel when clicked on either of input fields
  const [vehicleFound, setVehicleFound] = React.useState(false);
  const [waitingForDriver, setWaitingForDriver] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]); // suggestions from backend
  const [activeField, setActiveField] = React.useState(null); // 'pickup' or 'destination'
  const panelRef = React.useRef(null);
  const panelCloseRef = React.useRef(null);
  const vehiclePanelRef = React.useRef(null);
  const confirmRidePanelRef = React.useRef(null)
  const vehicleFoundRef = React.useRef(null);
  const waitingForDriverRef = React.useRef(null);
  const [fare, setFare] = React.useState({})

  // Fetch suggestions from backend
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuggestions(res.data);
    } catch (err) {
      setSuggestions([]);
    }
  };

  // Handle input changes and fetch suggestions
  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    setActiveField('pickup');
    fetchSuggestions(e.target.value);
    setPanelOpen(true);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setActiveField('destination');
    fetchSuggestions(e.target.value);
    setPanelOpen(true);
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion.description);
    } else if (activeField === 'destination') {
      setDestination(suggestion.description);
    }
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPanelOpen(false);
    setVehiclePanel(true);
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(response.data);
    setFare(response.data);

    setPickup('');
    setDestination('');
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '60%',
        padding: 15
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%'
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' alt="temporary-image" />
      </div>
      <div className='h-screen flex flex-col justify-end absolute top-0 w-full'>
        <div className='p-5 bg-white relative'>
          <h5
            ref={panelCloseRef}
            onClick={() => { setPanelOpen(false); setSuggestions([]); }}
            className='absolute opacity-0 top-4 right-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-bold'>Find Your Trip</h4>
          <form onSubmit={handleSubmit}>
            <input
              onClick={() => { setPanelOpen(true); setActiveField('pickup'); fetchSuggestions(pickup); }}
              value={pickup}
              required
              onChange={handlePickupChange}
              className='bg-[#eee] m-2 px-8 py-2 text-base rounded-lg w-full'
              type="text"
              placeholder='add a pickup location'
              autoComplete="off"
            />
            <input
              onClick={() => { setPanelOpen(true); setActiveField('destination'); fetchSuggestions(destination); }}
              value={destination}
              required
              onChange={handleDestinationChange}
              className='bg-[#eee] m-2 px-8 py-2 text-base rounded-lg w-full'
              type="text"
              placeholder='enter your destination'
              autoComplete="off"
            />
            <button className="mt-2 ml-2 w-full font-semibold bg-black text-white px-5 py-2 rounded-2xl border-none active:bg-green-600 transition">
              Find Trip
            </button>
          </form>
        </div>
        <div ref={panelRef} className='bg-white'>
          <LocationPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>
      <div>
        <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
          <VehiclePanel fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
        </div>
      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <LookingForDriver setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel} />
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white p-3'>
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home