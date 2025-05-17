import React from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useGSAP } from '@gsap/react'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom'
import LogoImage from '../assets/logo.png'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'

const CaptainHome = () => {

  const [ride, setRide] = React.useState(null);

  const [ridePopUpPanel, setRidePopUpPanel] = React.useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = React.useState(false);
  const ridePopUpPanelRef = React.useRef(null);
  const confirmRidePopUpPanelRef = React.useRef(null);

  const { socket } = React.useContext(SocketContext);
  const { captain } = React.useContext(CaptainDataContext);

  React.useEffect(() => {
    console.log(captain);
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
    console.log(data);
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
      <div className='p-3 absolute top-0 flex items-center justify-between w-screen'>
        <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
        <Link to='/captain-home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-[70%]'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" />
      </div>

      <div className='h-[30%] p-5'>
        <CaptainDetails />
      </div>

      <div ref={ridePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <RidePopUp ride={ride} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} confimRide={confirmRide} />
      </div>

      <div ref={confirmRidePopUpPanelRef} className='fixed h-[80%] w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <ConfirmRidePopUp setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      </div>
    </div >
  )
}

export default CaptainHome