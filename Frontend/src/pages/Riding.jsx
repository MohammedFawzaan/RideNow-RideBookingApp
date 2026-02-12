import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import captainImage from '../assets/captainImage.webp';
import { SocketContext } from '../context/SocketContext';
import RouteMap from '../components/RouteMap';
import DraggablePanel from '../components/DraggablePanel';

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const navigate = useNavigate();
    const { socket } = React.useContext(SocketContext);
    const [riding, setRiding] = useState(null);

    React.useEffect(() => {
        if (!ride) {
            navigate('/home');
        }
    }, [ride, navigate]);

    if (!ride) return null;

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
        <div className="h-screen overflow-hidden bg-gray-100">
            <div className="h-[90%] p-4 rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-gray-200">
                <RouteMap
                    pickup={ride.pickup}
                    destination={ride.destination}
                    onDriverLocationUpdate={handleUserLocationUpdate}
                />
            </div>
            <DraggablePanel isVisible={true}>
                <div className='flex items-center justify-between'>
                    <img className='h-14' src={captainImage} alt="Captain-Image" />
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
            </DraggablePanel>
        </div>
    );
};

export default Riding;