import React from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom'
import RideNowIcon from '../assets/RideNowIcon.png'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {

  const [ride, setRide] = React.useState(null);

  const [ridePopUpPanel, setRidePopUpPanel] = React.useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = React.useState(false);
  const ridePopUpPanelRef = React.useRef(null);
  const confirmRidePopUpPanelRef = React.useRef(null);

  const { socket } = React.useContext(SocketContext);
  const { captain } = React.useContext(CaptainDataContext);

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
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
      rideId: ride._id,
      captainId: captain._id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
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

  useGSAP(function () {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopUpPanel])

  return (
    <div className='h-screen overflow-hidden'>
      <div className='h-[90%]'>
        <LiveTracking />
        {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" /> */}
      </div>

      <div className='p-3 absolute top-10 flex items-center justify-center w-screen gap-4'>
        <img className='flex w-36 bg-white rounded-lg' src={RideNowIcon} alt="ride-logo" />
        <Link to='/captains/logout' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='fixed bottom-0 p-5'>
        <CaptainDetails />
      </div>

      <div ref={ridePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <RidePopUp ride={ride} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} confirmRide={confirmRide} />
      </div>

      <div ref={confirmRidePopUpPanelRef} className='fixed h-[80%] w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <ConfirmRidePopUp ride={ride} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      </div>
    </div >
  )
}

export default CaptainHome