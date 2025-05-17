import React from 'react'
import axios from 'axios'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import LogoImage from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import LocationPanel from '../components/LocationPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { UserDataContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext'

const Home = () => {
  const [pickup, setPickup] = React.useState(''); // pickup input
  const [destination, setDestination] = React.useState(''); // destination input

  const [panelOpen, setPanelOpen] = React.useState(false); // to open Find a Trip Panel when clicked on either of input fields
  const [vehiclePanel, setVehiclePanel] = React.useState(false); // to open vehiclePanel when clicked on location
  const [confirmRidePanel, setConfirmRidePanel] = React.useState(false); // to open confirmRide panel when clicked on vehicle

  const [vehicleFound, setVehicleFound] = React.useState(false);
  const [waitingForDriver, setWaitingForDriver] = React.useState(false);

  const [suggestions, setSuggestions] = React.useState([]); // suggestions from backend
  const [activeField, setActiveField] = React.useState(null); // 'pickup' or 'destination'

  const [fare, setFare] = React.useState({});
  const [vehicleType, setVehicleType] = React.useState(null);
  const [vehicleImage, setVehicleImage] = React.useState(null);

  const panelRef = React.useRef(null);
  const panelCloseRef = React.useRef(null);
  const vehiclePanelRef = React.useRef(null);
  const confirmRidePanelRef = React.useRef(null)

  const vehicleFoundRef = React.useRef(null);
  const waitingForDriverRef = React.useRef(null);

  const { user } = React.useContext(UserDataContext);
  const { socket } = React.useContext(SocketContext);

  const [ride, setRide] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(user);
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on('ride-confirmed', (ride) => {
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on('ride-started', (ride) => {
    setWaitingForDriver(false);
    navigate('/riding', { state: { ride } });
  });

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
    setFare(response.data);
  }

  const createRide = async () => {
    const token = localStorage.getItem('token');
    console.log(pickup, destination, vehicleType);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }
    );
    console.log(response.data);
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
      <div className='p-3 absolute top-0 flex items-center justify-between w-screen'>
        <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
        <Link to='/users/logout' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>
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
              onChange={(e) => {
                setPickup(e.target.value);
                setActiveField('pickup');
                fetchSuggestions(e.target.value);
                // setPanelOpen(true);
              }}
              className='bg-[#eee] m-2 px-8 py-2 text-base rounded-lg w-full'
              type="text"
              placeholder='add a pickup location'
              autoComplete="off"
            />
            <input
              onClick={() => { setPanelOpen(true); setActiveField('destination'); fetchSuggestions(destination); }}
              value={destination}
              required
              onChange={(e) => {
                setDestination(e.target.value);
                setActiveField('destination');
                fetchSuggestions(e.target.value);
                // setPanelOpen(true);
              }}
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
          <VehiclePanel selectVehicle={setVehicleType} setVehicleImage={setVehicleImage} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
        </div>
      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <ConfirmRide createRide={createRide} vehicleImage={vehicleImage} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <LookingForDriver pickup={pickup} vehicleImage={vehicleImage} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel} />
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white p-3'>
        <WaitingForDriver ride={ride} vehicleImage={vehicleImage} setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home