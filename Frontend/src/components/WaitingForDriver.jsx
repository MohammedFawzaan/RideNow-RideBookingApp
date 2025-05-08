import React from 'react'
import CarImage from '../assets/CarImage.jpg'

const WaitingForDriver = (props) => {
  return (
    <div>
      <div>
        <i onClick={() => { props.setwaitingForDriver(true) }} className="text-3xl ri-arrow-down-wide-fill"></i>
        <h3 className='text-2xl font-semibold mb-3'>Meet At Pickup Point</h3>
      </div>

      <div className='flex items-center justify-between'>
        <img className='h-14' src={CarImage} alt="Car-Icon" />
        <div className='text-right'>
          <h2 className='text-lg font-medium'>Driver</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>MP 04 AB 1234</h4>
          <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
        </div>
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
    </div>
  )
}

export default WaitingForDriver