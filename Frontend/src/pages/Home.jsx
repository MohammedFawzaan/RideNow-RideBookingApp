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
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    // Initial join
    socket.emit("join", { userType: "user", userId: user._id });

    // Handle re-connection
    const handleConnect = () => {
      console.log("Socket re-connected, re-joining...");
      socket.emit("join", { userType: "user", userId: user._id });
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user, socket]);

  React.useEffect(() => {
    const handleRideConfirmed = (ride) => {
      console.log("Ride confirmed event received:", ride);
      setVehicleFound(false);
      setRide(ride);
      navigate('/pickup', { state: { ride, vehicleImage } });
    };

    const handleRideCancelled = (data) => {
      console.log("Ride cancelled event received:", data);
      setVehicleFound(false);
      setRide(null);

      if (data && data.reason === 'timeout') {
        toast.error("No Riders Nearby");
      } else {
        toast.info("Ride cancelled");
      }
    };

    socket.on('ride-confirmed', handleRideConfirmed);
    socket.on('ride-cancelled', handleRideCancelled);

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed);
      socket.off('ride-cancelled', handleRideCancelled);
    };
  }, [socket, vehicleImage, navigate]);

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input }
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
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination }
        }
      );
      setFare(response.data);
      setVehiclePanel(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Unable to find route');
    } finally {
      setIsLoading(false);
    }
  }

  const [activeTrip, setActiveTrip] = React.useState(null);

  const createRide = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType,
      }, {
      });

      setRide(response.data); // Capture the created ride details
      toast.success('Ride request sent!');

      // Save trip details for the next screen before clearing inputs
      setActiveTrip({
        pickup,
        destination,
        fare: fare[vehicleType],
        vehicleType
      });

      setVehicleFound(true);
      setConfirmRidePanel(false);

      // Clear inputs
      setPickup('');
      setDestination('');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ride');
      setVehicleFound(false); // Reset state on failure
      setConfirmRidePanel(true); // Go back to confirm panel
    } finally {
      setIsLoading(false);
    }
  }

  const cancelRide = async () => {
    if (!ride) return;
    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/ride-cancel`, {
        rideId: ride._id
      }, {
      });
      toast.success('Ride cancelled');
      setVehicleFound(false);
      setRide(null);
    } catch (error) {
      toast.error('Failed to cancel ride');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      <div className='p-3 absolute top-10 flex items-center justify-center w-full gap-4 z-10 pointer-events-none'>
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
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <div className='flex items-center gap-5 p-3 rounded-lg w-full mt-5'>
              <i className="ri-map-pin-user-fill text-xl"></i>
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setVehiclePanel(false);
                  setConfirmRidePanel(false);
                  setActiveField('pickup');
                  fetchSuggestions(pickup);
                }}
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  setActiveField('pickup');
                  fetchSuggestions(e.target.value);
                }}
                className='bg-[#eee] px-2 py-2 text-base rounded-lg w-full outline-none'
                type="text"
                placeholder='Add a pickup location'
                required
              />
              <i
                onClick={async () => {
                  setPickup('Fetching location...');
                  navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
                      if (response.data.status === 'OK' && response.data.results.length > 0) {
                        setPickup(response.data.results[0].formatted_address);
                      } else {
                        setPickup('');
                        toast.error('Could not find address');
                      }
                    } catch (error) {
                      console.error(error);
                      setPickup('');
                      toast.error('Error fetching location');
                    }
                  });
                }}
                className="ri-crosshair-2-fill text-xl cursor-pointer hover:text-black transition-colors"
                title="Use Current Location"
              ></i>
            </div>
            <div className='flex items-center gap-5 p-3 rounded-lg w-full'>
              <i className="ri-map-pin-2-fill text-xl"></i>
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setVehiclePanel(false);
                  setConfirmRidePanel(false);
                  setActiveField('destination');
                  fetchSuggestions(destination);
                }}
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setActiveField('destination');
                  fetchSuggestions(e.target.value);
                }}
                className='bg-[#eee] px-2 py-2 text-base rounded-lg w-full outline-none'
                type="text"
                placeholder='Enter your destination'
                required
              />
            </div>
            <button
              disabled={isLoading}
              className="mt-2 ml-2 w-full font-semibold bg-black text-white px-5 py-2 rounded-2xl border-none active:bg-green-600 transition disabled:opacity-50">
              {isLoading ? 'Finding...' : 'Find Trip'}
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
            isLoading={isLoading}
          />
        </DraggablePanel>
      )}
      {vehicleFound && (
        <DraggablePanel isVisible={vehicleFound}>
          <LookingForDriver
            createRide={createRide}
            cancelRide={cancelRide}
            pickup={activeTrip?.pickup || pickup}
            vehicleImage={vehicleImage}
            destination={activeTrip?.destination || destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
            setConfirmRidePanel={setConfirmRidePanel}
            isLoading={isLoading}
          />
        </DraggablePanel>
      )}
    </div>
  )
}

export default Home