import { toast } from 'react-toastify';

const ConfirmRide = (props) => {

  const onSubmit = (e) => {
    e.preventDefault();
    props.setConfirmRidePanel(false);
    props.setVehicleFound(true);
    props.createRide();
    toast.success('Searching for nearby captains...');
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-semibold mb-3'>Confirm Your Ride</h3>
      </div>
      <div className='flex flex-col justify-between items-center gap-2'>
        <img className='h-20 m-5' src={props.vehicleImage} alt="Car-Image" />
      </div>
      <div className='w-full mt-5'>
        <div>
          <button onClick={(e) => onSubmit(e)} className='w-full mt-5 text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg'>Confirm</button>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="ri-map-pin-line"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>Pickup</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="text-lg ri-map-pin-fill"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>Destination</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3'>
          <i className="ri-bank-card-2-line"></i>
          <div className=''>
            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmRide