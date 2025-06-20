import React from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useLocation, useNavigate } from "react-router-dom"
import WaitingForDriver from "../components/WaitingForDriver"
import PickupNavigation from "../components/PickupNavigation"
import { SocketContext } from "../context/SocketContext"

const Pickup = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { ride, vehicleImage } = location.state || {};

  const { socket } = React.useContext(SocketContext);

  const waitingForDriverRef = React.useRef(null);
  const [waitingForDriver, setWaitingForDriver] = React.useState(false);

  const pickup = ride.pickup;

  React.useEffect(() => {
    setWaitingForDriver(true);
  });

  socket.on('ride-started', (ride) => {
    navigate('/riding', { state: { ride } });
  });

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  return (
    <div>
        <PickupNavigation pickupLocation={pickup} />

        <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white p-3' style={{ transform: 'translateY(100%)' }}>
          <WaitingForDriver
            ride={ride}
            vehicleImage={vehicleImage}
            setWaitingForDriver={setWaitingForDriver}
          />
        </div>
    </div>
  )
}

export default Pickup