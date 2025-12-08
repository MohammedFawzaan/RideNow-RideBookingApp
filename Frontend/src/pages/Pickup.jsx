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
  const waitingForDriverRef = React.useRef(null);

  const pickup = ride.pickup;

  React.useEffect(() => {
    setWaitingForDriver(true);
  }, []);

  React.useEffect(() => {
    if (ride)
      toast.success('A captain accepted your ride! 🎉');
  }, [ride]);

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
    <div className="relative h-screen w-full overflow-hidden">
      <div className="h-[90%] w-full rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-gray-200 mt-4">
        <PickupNavigation
          pickupLocation={pickup}
          onDriverLocationUpdate={handleDriverLocationUpdate}
        />
      </div>
      <DraggablePanel isVisible={waitingForDriver}>
        <WaitingForDriver
          ride={ride}
          vehicleImage={vehicleImage}
          driverDistance={driverDistance}
          setWaitingForDriver={setWaitingForDriver}
        />
      </DraggablePanel>
    </div>
  );
};

export default Pickup;