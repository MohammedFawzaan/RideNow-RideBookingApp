import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
        <div className='flex items-center justify-between gap-4 p-2'>
          <div className='flex items-center'>
            <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjsdrJhuv3FcZmEE9MHYjIaJ5DOxSIQ39BWg&s" alt="driver-image" />
            <h4 className='text-xl font-medium ml-2'>User Name</h4>
          </div>
          <div>
            <h4 className='text-xl font-semibold'>$192.20</h4>
            <p className='text-sm font-medium text-gray-600'>Earned</p>
          </div>
        </div>
        <div className='flex items-center bg-gray-300 justify-around rounded-xl p-2 my-3 gap-5'>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-timer-2-line"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-speed-up-line"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl font-thin ri-book-fill"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails