import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import PickupNavigation from '../components/PickupNavigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainPickup = () => {
  const location = useLocation();
  const rideData = location.state?.ride;

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = React.useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);

  useEffect(() => {
    setConfirmRidePopUpPanel(true);
  });

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
    <div>
      <PickupNavigation pickupLocation={rideData.pickup} />

      <div ref={confirmRidePopUpPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3'>
        <ConfirmRidePopUp ride={rideData} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      </div>
    </div>
  )
}

export default CaptainPickup