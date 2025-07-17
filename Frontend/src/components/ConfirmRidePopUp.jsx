import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import userImage from '../assets/userImage.png'
import { toast } from 'react-toastify'

const ConfirmRidePopUp = (props) => {

    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status === 200) {
            props.setConfirmRidePopUpPanel(false);
            toast.success('Ride Started');
            navigate('/captain-riding', { state: { ride: props.ride } });
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold my-2'>Confirm Ride To Start</h3>
                {/* <i onClick={() => { props.setRidePopUpPanel(false)} } className="text-3xl ri-arrow-down-wide-fill"></i> */}
            </div>
            <div className='flex items-center justify-between rounded-lg p-3 bg-yellow-400'>
                <div className='flex items-center gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src={userImage} alt="person-image" />
                    <div>
                        <p className='capitalize font-medium text-base'>{props.ride?.user.fullname.firstname}</p>
                        <p className='capitalize font-medium text-base'>{props.ride?.user.fullname.lastname}</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-sm font-medium text-green-600'>{props.driverDistance?.time} & {props.driverDistance?.distance} Away</p>
                </div>
            </div>
            <form className='flex items-center justify-center mt-2 gap-2' onSubmit={(e) => { handleSubmit(e) }}>
                <input value={otp} onChange={(e) => { setOtp(e.target.value) }} className='bg-[#eee] px-3 py-1.5 text-sm rounded-lg w-auto' required type="text" placeholder='Enter OTP' />
                <button className='text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg text-sm'>&#10004;</button>
            </form>
            <div className='w-full mt-1'>
                <div className='flex items-center gap-4 p-2 border-b'>
                    <i className="ri-map-pin-line"></i>
                    <div>
                        <h3 className='text-base font-medium'>Pickup</h3>
                        <p className='text-xs text-gray-600'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-2 border-b'>
                    <i className="ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-base font-medium'>Destination</h3>
                        <p className='text-xs text-gray-600'>{props.ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-2'>
                    <i className="ri-bank-card-2-line"></i>
                    <div>
                        <h3 className='text-base font-medium'>₹{props.ride?.fare}</h3>
                        <p className='text-xs text-gray-600'>Cash</p>
                    </div>
                </div>
                <button onClick={() => { navigate('/captain-home'); }} className='w-full text-white bg-red-400 active:bg-red-600 font-semibold p-2 rounded-lg text-sm'>Cancel</button>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp