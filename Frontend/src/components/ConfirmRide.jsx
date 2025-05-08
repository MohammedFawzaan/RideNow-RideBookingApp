import React from 'react'
import CarImage from '../assets/CarImage.jpg'

const ConfirmRide = (props) => {
  return (
    <div>
      <div>
        <i onClick={() => props.setConfirmRidePanel(false)} className="text-3xl ri-arrow-down-wide-fill"></i>
        <h3 className='text-2xl font-semibold mb-3'>Confirm Your Ride</h3>
      </div>
      <div className='flex flex-col justify-between items-center gap-2'>
        <img className='h-20 m-5' src={CarImage} alt="Car-Image" />
      </div>
      <div className='w-full mt-5'>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="ri-map-pin-line"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>522/A11</h3>
            <p className='text-sm -mt-1 text-gray-600'>Tolichowki Paramount, Hyderabad</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="text-lg ri-map-pin-fill"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>314/C13</h3>
            <p className='text-sm -mt-1 text-gray-600'>Agra ,Delhi</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3'>
          <i className="ri-bank-card-2-line"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>$193.20</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => { props.setConfirmRidePanel(false); props.setVehicleFound(true) }} className='w-full mt-5 text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg'>Confirm</button>
      </div>
    </div>
  )
}

export default ConfirmRide