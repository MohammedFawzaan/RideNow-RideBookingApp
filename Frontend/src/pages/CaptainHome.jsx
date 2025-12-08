import React from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import { Link, useNavigate } from 'react-router-dom'
import RideNowIcon from '../assets/RideNowIcon.png'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import { toast } from 'react-toastify';

const CaptainHome = () => {

  const [ride, setRide] = React.useState(null);

  const [ridePopUpPanel, setRidePopUpPanel] = React.useState(false);
  const ridePopUpPanelRef = React.useRef(null);

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
    }
  }

  useGSAP(function () {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [ridePopUpPanel])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* Map Container */}
      <div className="flex-1 m-4 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative z-0">
        <LiveTracking />
      </div>

      {/* Top Bar */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-6 z-20">
        <img
          onClick={() => navigate('/captain-home')}
          className="w-32 md:w-36 bg-white rounded-xl cursor-pointer p-2 shadow-md hover:shadow-lg transition-all"
          src={RideNowIcon}
          alt="ride-logo"
        />

        <Link
          onClick={() => toast.success('You are Logged Out')}
          to="/captains/logout"
          className="h-12 w-12 bg-white flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all">
          <i className="ri-logout-box-r-line text-xl"></i>
        </Link>
      </div>

      {/* Bottom Captain Details Panel */}
      <div className="bg-white w-full p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
        <CaptainDetails />
      </div>

      {/* Ride Popup Panel */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed w-full z-30 bottom-0 translate-y-full bg-white p-5
               rounded-t-3xl shadow-[0_-10px_25px_rgb(0,0,0,0.2)] transition-all">
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>
    </div>
  )
}

export default CaptainHome