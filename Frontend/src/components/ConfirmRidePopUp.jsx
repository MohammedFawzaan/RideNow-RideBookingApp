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
                <h3 className='text-2xl font-bold my-3'>Confirm Ride To Start</h3>
                {/* <i onClick={() => { props.setRidePopUpPanel(false)} } className="text-3xl ri-arrow-down-wide-fill"></i> */}
            </div>
            <div className='flex items-center justify-between rounded-lg p-3 bg-yellow-400'>
                <div className='flex items-center justify-center gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src={userImage} alt="person-image" />
                    <p className='capitalize font-medium'>{props.ride?.user.fullname.firstname + ' ' + props.ride?.user.fullname.lastname}</p>
                </div>
            </div>
            <form className='flex items-center justify-center mt-3 gap-2' onSubmit={(e) => { handleSubmit(e) }}>
                <input value={otp} onChange={(e) => { setOtp(e.target.value) }} className='bg-[#eee] px-4 py-2 text-base rounded-lg w-auto' required type="text" placeholder='Enter OTP' />
                <button className='block text-center text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg'>&#10004;</button>
            </form>
            <div className='w-full mt-1'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-map-pin-line"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Pickup</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-fill"></i>
                    <div className=''>
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
                <button onClick={() => { navigate('/captain-home'); }} className='flex items-center justify-center w-full text-white bg-red-400 active:bg-red-600 font-semibold p-2 rounded-lg'>Cancel</button>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp