import React from 'react'
import { useNavigate } from 'react-router-dom';

const WaitingForDriver = (props) => {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold m-2">Meet At Pickup Point</h3>
      </div>

      <div className="flex items-center justify-between ml-3">
        <div className='flex items-center justify-center gap-3'>
          {/* Image */}
          <img className="h-12" src={props.vehicleImage} alt="Car-Icon" />

          {/* Time + Distance */}
          <div className="text-center">
            <p className="text-lg font-medium text-green-600">{props.driverDistance?.time} &</p>
            <p className="text-lg font-medium text-green-600">{props.driverDistance?.distance} Away</p>
          </div>
        </div>

        {/* Fare */}
        {/* <div className="text-center">
          <i className="ri-bank-card-2-line"></i>
          <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
          <p className="text-sm text-gray-600">Cash</p>
        </div> */}

        {/* Captain Details */}
        <div className="text-right">
          <h2 className="text-lg capitalize font-medium">
            Captain - {props.ride?.captain.fullname.firstname}
          </h2>
          <h4 className="text-lg font-medium -mt-1 -mb-1">
            {props.ride?.captain.vehicle.plate}
          </h4>
          <p className="text-lg font-medium text-green-600">
            OTP - {props.ride?.otp}
          </p>
        </div>
      </div>
      {/* Pickup & Destination */}
      <div className="w-full">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-line"></i>
          <div>
            <h3 className="text-lg font-medium">Pick Up At</h3>
            <p className="text-sm -mt-1 text-gray-600">{props.ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-lg ri-map-pin-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Destination</h3>
            <p className="text-sm -mt-1 text-gray-600">{props.ride?.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3">
          <i className="ri-bank-card-2-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash</p>
          </div>
        </div>
        <button onClick={() => { navigate('/home'); }} className='w-full text-white bg-red-400 active:bg-red-600 font-semibold p-2 rounded-lg text-sm'>Cancel</button>
      </div>
    </div>
  )
}

export default WaitingForDriver