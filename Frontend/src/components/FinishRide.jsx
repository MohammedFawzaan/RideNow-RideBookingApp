import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import userImage from '../assets/userImage.png'

const FinishRide = (props) => {

  const navigate = useNavigate();

  async function endRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
      rideId: props.ride._id
    })
    if (response.status === 200) {
      navigate('/captain-home')
    }
  }

  return (
    <div>
      <div>
        <h3 className='text-2xl font-semibold mb-3'>Finish this Ride</h3>
      </div>
      <div className='flex flex-col justify-between items-center gap-2'>
        {/* <img className='h-20 m-5' src={CarImage} alt="Car-Image" /> */}
      </div>
      <div className='flex items-center justify-between rounded-lg p-3 bg-yellow-300'>
        <div className='flex items-center justify-center gap-3'>
          <img className='h-10 w-10 rounded-full object-cover' src={userImage} alt="person-image" />
          <h2 className='text-base font-semibold'>{props.ride?.user.fullname.firstname + ' ' + props.ride?.user.fullname.lastname}</h2>
        </div>
        <h5 className='text-lg font-semibold'>Reached</h5>
      </div>
      <div className='w-full'>
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
      </div>
      <div>
        <button onClick={endRide} className='w-full text-center text-white bg-green-400 active:bg-green-600 font-semibold p-3 rounded-lg'>End Ride</button>
        <p className='text-gray-600 font-semibold text-center text-sm my-2'>End the Ride if passenger has made the payment</p>
      </div>
    </div>
  )
}

export default FinishRide