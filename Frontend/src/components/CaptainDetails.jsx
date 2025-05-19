import React from 'react'
import { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import captainIcon from '../assets/captainImage.webp'

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div>
      <div className='flex items-center justify-between gap-4 p-2'>
        <div className='flex items-center'>
          <img className='h-10 w-10 rounded-full object-cover' src={captainIcon} alt="driver-image" />
          <h4 className='text-xl capitalize font-medium ml-2'>
            {(captain?.fullname?.firstname || 'Captain') + ' ' + (captain?.fullname?.lastname || '')}
          </h4>
        </div>
      </div>

      <div className='flex items-center bg-gray-300 justify-around rounded-xl p-2 my-3 gap-5'>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-timer-2-line"></i>
            <h5 className='text-lg font-medium'>10</h5>
            <p className='text-sm text-gray-600'>Hours Online</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-speed-up-line"></i>
            <h5 className='text-lg font-medium'>90km</h5>
            <p className='text-sm text-gray-600'>Total Distance</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-book-fill"></i>
            <h5 className='text-lg font-medium'>20</h5>
            <p className='text-sm text-gray-600'>Total Rides</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails