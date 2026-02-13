import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import Loader from '../components/Loader';

const UserProtectedWrapper = ({ children }) => {
  const { user, isLoading } = React.useContext(UserDataContext);
  const [rideCheckLoading, setRideCheckLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user.token) {
      navigate('/users/login');
      return;
    }

    // Check for active ride
    axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-current-ride`)
      .then(rideRes => {
        const ride = rideRes.data;
        if (ride) {
          if (ride.status === 'accepted') {
            navigate('/pickup', { state: { ride } });
          } else if (ride.status === 'ongoing') {
            navigate('/riding', { state: { ride } });
          }
        }
      })
      .catch(err => {
        console.error("Error fetching current ride:", err);
      })
      .finally(() => {
        setRideCheckLoading(false);
      });

  }, [isLoading, user, navigate]);

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

export default UserProtectedWrapper