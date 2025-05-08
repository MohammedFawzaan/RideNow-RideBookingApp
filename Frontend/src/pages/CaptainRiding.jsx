import React from 'react'
import LogoImage from '../assets/logo.png'
import { Link } from 'react-router-dom'

const CaptainRiding = () => {
  return (
    <div className='h-screen relative overflow-hidden'>
      <div className='p-3 absolute top-0 flex items-center justify-between w-screen'>
        <img className='w-20 absolute top-5 left-5' src={LogoImage} alt="uber-logo" />
        <Link to='/captain-home' className='fixed top-2 right-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-4/5'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="temp-image" />
      </div>

      <div className='h-1/5 px-5 bg-yellow-400 flex items-center justify-between'>
        <div className='flex items-center justify-center'>
            <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {

            }}><i className='text-3xl text-gray-800 ri-arrow-up-wide-line'></i></h5>
            <i className="mr-2 ri-map-pin-line"></i>
            <h4 className='text-xl font-semibold'>4m away</h4>
        </div>
        <button className='mt-5 text-white bg-green-400 active:bg-green-600 font-semibold p-3 rounded-lg'>Complete Ride</button>
      </div>
    </div >
  )
}

export default CaptainRiding