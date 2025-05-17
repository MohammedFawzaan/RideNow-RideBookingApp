import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import CarImage from '../assets/CarImage.jpg'
import LogoImage from '../assets/logo.png'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from './LiveTracking'

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const navigate = useNavigate();
    const { socket } = React.useContext(SocketContext);

    socket.on('ride-ended',() => {
        navigate('/home');
    });

    return (
        <div className='h-screen overflow-hidden'>
            <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
            <Link to='/home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-2-fill"></i>
            </Link>
            <div className='h-3/5'>
                <LiveTracking />
                {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" /> */}
            </div>
            <div className='p-5'>
                {/* Current Ride Status */}
                <div className='flex items-center justify-between'>
                    <img className='h-14' src={CarImage} alt="Car-Icon" />
                    <div className='text-right'>
                        <h2 className='text-lg capitalize font-medium'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                    </div>
                </div>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-bank-card-2-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                <button className='w-full mt-5 text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg'>Make a Payment</button>
            </div>
        </div >
    )
}

export default Riding