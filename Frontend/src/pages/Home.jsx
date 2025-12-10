import React from 'react'
import axios from 'axios'
import gsap from 'gsap'
import { toast } from 'react-toastify'
import 'remixicon/fonts/remixicon.css'
import { useGSAP } from '@gsap/react'
import { Link, useNavigate } from 'react-router-dom'
import RideNowIcon from '../assets/RideNowIcon.png'
import LocationPanel from '../components/LocationPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import { UserDataContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext'
import LiveTracker from '../components/LiveTracking'
import DraggablePanel from '../components/DraggablePanel'

const Home = () => {
  const [pickup, setPickup] = React.useState(''); // pickup input
  const [destination, setDestination] = React.useState(''); // destination input

  const [panelOpen, setPanelOpen] = React.useState(false); // to open Find a Trip Panel when clicked on either of input fields
  const [vehiclePanel, setVehiclePanel] = React.useState(false); // to open vehiclePanel when clicked on location
  const [confirmRidePanel, setConfirmRidePanel] = React.useState(false); // to open confirmRide panel when clicked on vehicle

  const [vehicleFound, setVehicleFound] = React.useState(false);

  const [suggestions, setSuggestions] = React.useState([]); // suggestions from backend
  const [activeField, setActiveField] = React.useState(null); // 'pickup' or 'destination'

  const [fare, setFare] = React.useState({});
  const [vehicleType, setVehicleType] = React.useState(null);
  const [vehicleImage, setVehicleImage] = React.useState(null);

  const panelRef = React.useRef(null);
  const panelCloseRef = React.useRef(null);

  const { user } = React.useContext(UserDataContext);
  const { socket } = React.useContext(SocketContext);

  const [ride, setRide] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on('ride-confirmed', (ride) => {
    setVehicleFound(false);
    setRide(ride);
    navigate('/pickup', { state: { ride, vehicleImage } });
  });

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
    });
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '50%',
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

  return (
    <div className='h-screen flex flex-col overflow-hidden bg-gray-100'>
      <div className='h-[70vh] m-5 rounded-3xl overflow-hidden shadow-2xl relative z-0'>
        <LiveTracker />
      </div>
      <div className='p-3 absolute top-10 flex items-center justify-center w-screen gap-4 z-10 pointer-events-none'>
        <img onClick={() => navigate('/home')} className='flex w-36 bg-white rounded-lg cursor-pointer pointer-events-auto' src={RideNowIcon} alt="ride-logo" />
        <Link onClick={() => toast.success('You are Logged Out')} to='/users/logout' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full pointer-events-auto'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className='absolute bottom-0 left-0 w-full z-20'>
        <div className='p-5 bg-white relative'>
          <h5
            ref={panelCloseRef}
            onClick={() => { setPanelOpen(false); setSuggestions([]); }}
            className='absolute opacity-0 top-4 right-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='ml-2 text-2xl font-bold'>Find Your Trip</h4>
          <form onSubmit={handleSubmit}>
            <input
              onClick={() => { setPanelOpen(true); setActiveField('pickup'); fetchSuggestions(pickup); }}
              value={pickup}
              required
              onChange={(e) => {
                setPickup(e.target.value);
                setActiveField('pickup');
                fetchSuggestions(e.target.value);
              }}
              className='bg-[#eee] m-2 px-8 py-2 rounded-lg w-full'
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
        <div ref={panelRef} className='bg-white max-h-[40vh] overflow-y-auto'>
          <LocationPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>
      {vehiclePanel && (
        <DraggablePanel isVisible={vehiclePanel}>
          <VehiclePanel
            selectVehicle={setVehicleType}
            setVehicleImage={setVehicleImage}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </DraggablePanel>
      )}
      {confirmRidePanel && (
        <DraggablePanel isVisible={confirmRidePanel}>
          <ConfirmRide
            createRide={createRide}
            vehicleImage={vehicleImage}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </DraggablePanel>
      )}
      {vehicleFound && (
        <DraggablePanel isVisible={vehicleFound}>
          <LookingForDriver
            pickup={pickup}
            vehicleImage={vehicleImage}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
            setConfirmRidePanel={setConfirmRidePanel}
          />
        </DraggablePanel>
      )}
    </div>
  )
}

export default Home