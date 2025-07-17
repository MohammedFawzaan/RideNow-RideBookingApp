import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import captainImage from '../assets/captainImage.webp';
import { SocketContext } from '../context/SocketContext';
import RouteMap from '../components/RouteMap';
import axios from 'axios';

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const navigate = useNavigate();
    const { socket } = React.useContext(SocketContext);
    const [riding, setRiding] = useState(null);

    const handleUserLocationUpdate = async (userLocation) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
                params: { 
                    origin: `${userLocation.lat},${userLocation.lng}`, 
                    destination: ride.destination 
                },
            });
            setRiding(res.data);
        } catch (err) {
            console.error('Failed to fetch ride info:', err);
        }
    };

    socket.on('ride-ended', () => {
        navigate('/home');
    });

    function endRide() {
        navigate('/home');
    }

    return (
        <div className='h-screen overflow-hidden'>
            <div className='h-3/5'>
                <RouteMap
                    pickup={ride.pickup}
                    destination={ride.destination}
                    onDriverLocationUpdate={handleUserLocationUpdate}
                />
            </div>
            <div className='p-5'>
                <div className='flex items-center justify-between'>
                    <img className='h-14' src={captainImage} alt="Car-Icon" />
                    <div className='text-right'>
                        <h2 className='text-lg capitalize font-medium'>Captain's Name - {ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-lg font-medium -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>
                                Arrival in {riding?.time}, {riding?.distance} Away
                            </h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-bank-card-2-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={endRide} 
                    className='w-full mt-3 mb-3 text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg'>
                    Payment Done
                </button>
            </div>
        </div>
    );
};

export default Riding;