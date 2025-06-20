import React from "react"

const WaitingForDriver = (props) => {

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-semibold m-2'>Meet At Pickup Point</h3>
        <i onClick={() => { props.setWaitingForDriver(true) }} className="text-3xl ri-arrow-down-wide-fill"></i>
      </div>

      <div className='flex items-center justify-between'>
        <img className='h-14' src={props.vehicleImage} alt="Car-Icon" />
        <div className='text-right'>
          <h2 className='text-lg capitalize font-medium'>Captain's Name - {props.ride?.captain.fullname.firstname}</h2>
          <h4 className='text-lg font-medium -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
          <p className='text-lg font-medium'>OTP - {props.ride?.otp}</p>
        </div>
      </div>

      <div className='w-full mt-5'>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="ri-map-pin-line"></i>
          <div>
            <h3 className='text-lg font-medium'>Pick Up At</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="text-lg ri-map-pin-fill"></i>
          <div>
            <h3 className='text-lg font-medium'>Destination</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3'>
          <i className="ri-bank-card-2-line"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver