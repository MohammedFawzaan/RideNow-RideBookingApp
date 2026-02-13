import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import Loader from '../components/Loader';

const CaptainProtectedWrapper = ({ children }) => {
    const { captain, isLoading } = React.useContext(CaptainDataContext);
    const [rideCheckLoading, setRideCheckLoading] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!captain.token) {
            navigate('/captains/login');
            return;
        }

        // Check for active ride
        axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-current-ride`)
            .then(rideRes => {
                const ride = rideRes.data;
                if (ride) {
                    if (ride.status === 'accepted') {
                        navigate('/captain-pickup', { state: { ride } });
                    } else if (ride.status === 'ongoing') {
                        navigate('/captain-riding', { state: { ride } });
                    }
                }
            })
            .catch(err => {
                console.error("Error fetching current ride:", err);
            })
            .finally(() => {
                setRideCheckLoading(false);
            });

    }, [isLoading, captain, navigate]);

    if (isLoading || rideCheckLoading) {
        return (
            <Loader />
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectedWrapper