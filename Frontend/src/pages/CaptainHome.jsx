import React from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import RideNowIcon from '../assets/RideNowIcon.png'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import DraggablePanel from '../components/DraggablePanel'

const CaptainHome = () => {

  const [ride, setRide] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [ridePopUpPanel, setRidePopUpPanel] = React.useState(false);

  const { socket } = React.useContext(SocketContext);
  const { captain } = React.useContext(CaptainDataContext);

  const navigate = useNavigate();

  React.useEffect(() => {
    socket.emit("join", { userType: "captain", userId: captain._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();
  }, []);

  socket.on('new-ride', (data) => {
    setRide(data);
    setRidePopUpPanel(true);
  });

  async function confirmRide() {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
        rideId: ride._id,
        captainId: captain._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success("Ride Accepted");
      setRidePopUpPanel(false);
      navigate('/captain-pickup', { state: { ride: ride } });

    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Ride already accepted by another captain.");
        setRide(null);
        setRidePopUpPanel(false);
      } else {
        toast.error("Something went wrong while accepting the ride.");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* Map Container */}
      <div className="flex-1 m-4 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative z-0">
        <LiveTracking />
      </div>

      {/* Top Bar */}
      <div className="p-3 absolute top-10 w-full flex items-center justify-center gap-4 z-20">
        <img
          onClick={() => navigate('/captain-home')}
          className="w-36 bg-white rounded-lg cursor-pointer shadow-md"
          src={RideNowIcon}
          alt="ride-logo"
        />

        <Link
          onClick={() => toast.success('You are Logged Out')}
          to='/captains/logout'
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
        </Link>
      </div>

      {/* Bottom Captain Details */}
      <div className="bg-white w-full p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] z-10">
        <CaptainDetails />
      </div>

      {ride && (
        <DraggablePanel isVisible={ridePopUpPanel} maxHeight="60%">
          <RidePopUp
            ride={ride}
            setRidePopUpPanel={setRidePopUpPanel}
            confirmRide={confirmRide}
            isLoading={isLoading}
          />
        </DraggablePanel>
      )}
    </div>
  )
}

export default CaptainHome