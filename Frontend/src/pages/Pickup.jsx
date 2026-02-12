import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import { toast } from "react-toastify"
import gsap from "gsap"
import axios from "axios"
import WaitingForDriver from "../components/WaitingForDriver"
import PickupNavigation from "../components/PickupNavigation"
import { SocketContext } from "../context/SocketContext"
import DraggablePanel from "../components/DraggablePanel"

const Pickup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride, vehicleImage } = location.state || {};
  const { socket } = React.useContext(SocketContext);

  const [driverDistance, setDriverDistance] = React.useState(null);

  const [waitingForDriver, setWaitingForDriver] = React.useState(false);
  const [captainLiveLocation, setCaptainLiveLocation] = React.useState(null);

  React.useEffect(() => {
    setWaitingForDriver(true);
  }, []);

  const handleDriverLocationUpdate = async (driverLocation) => {
    if (!driverLocation || !ride?.pickup) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
        params: { origin: `${driverLocation.lat},${driverLocation.lng}`, destination: ride.pickup },
      });
      setDriverDistance(res.data);
    } catch (err) {
      console.error('Failed to fetch driver distance:', err);
    }
  };

  React.useEffect(() => {
    if (!ride) {
      navigate('/home');
      return;
    }

    socket.emit('join-ride', { rideId: ride._id, userType: 'user' });

    const handleLiveTracking = (data) => {
      setCaptainLiveLocation(data.location);
      handleDriverLocationUpdate(data.location);
    };

    const handleRideStarted = (ride) => {
      navigate('/riding', { state: { ride } });
    };

    const handleRideCancelled = () => {
      toast.info("Ride cancelled by captain");
      navigate('/home');
    };

    socket.on('live-tracking', handleLiveTracking);
    socket.on('ride-started', handleRideStarted);
    socket.on('ride-cancelled', handleRideCancelled);

    return () => {
      socket.off('live-tracking', handleLiveTracking);
      socket.off('ride-started', handleRideStarted);
      socket.off('ride-cancelled', handleRideCancelled);
    };
  }, [ride, navigate, socket]);

  if (!ride) return null;

  const pickup = ride.pickup;

  const cancelRide = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/ride-cancel`, {
        rideId: ride._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Ride cancelled');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to cancel ride');
      console.error(error);
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="h-[90%] w-full rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-gray-200 mt-4">
        <PickupNavigation
          pickupLocation={pickup}
          captainLiveLocation={captainLiveLocation}
          onDriverLocationUpdate={handleDriverLocationUpdate}
        />
      </div>
      <DraggablePanel isVisible={waitingForDriver}>
        <WaitingForDriver
          ride={ride}
          vehicleImage={vehicleImage}
          driverDistance={driverDistance}
          setWaitingForDriver={setWaitingForDriver}
          cancelRide={cancelRide}
        />
      </DraggablePanel>
    </div>
  );
};

export default Pickup;