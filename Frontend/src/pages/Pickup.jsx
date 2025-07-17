import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import WaitingForDriver from "../components/WaitingForDriver"
import PickupNavigation from "../components/PickupNavigation"
import { SocketContext } from "../context/SocketContext"

const Pickup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride, vehicleImage } = location.state || {};
  const { socket } = React.useContext(SocketContext);

  const [driverDistance, setDriverDistance] = React.useState(null);

  const [waitingForDriver, setWaitingForDriver] = React.useState(false);
  const waitingForDriverRef = React.useRef(null);

  const pickup = ride.pickup;

  React.useEffect(() => {
    setWaitingForDriver(true);
  }, []);

  const handleDriverLocationUpdate = async (driverLocation) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
        params: { origin: `${driverLocation.lat},${driverLocation.lng}`, destination: ride.pickup },
      });
      setDriverDistance(res.data);
    } catch (err) {
      console.error('Failed to fetch driver distance:', err);
    }
  };

  socket.on('ride-started', (ride) => {
    navigate('/riding', { state: { ride } });
  });

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [waitingForDriver]);

  return (
    <div>
      <PickupNavigation
        pickupLocation={pickup}
        onDriverLocationUpdate={handleDriverLocationUpdate}
      />
      <div
        ref={waitingForDriverRef}
        className='fixed w-full z-10 bottom-0 bg-white p-3'
        style={{ transform: 'translateY(100%)' }}>
        <WaitingForDriver
          ride={ride}
          vehicleImage={vehicleImage}
          driverDistance={driverDistance}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Pickup;