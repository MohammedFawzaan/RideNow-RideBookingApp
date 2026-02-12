import userImage from '../assets/userImage.png'

const RidePopUp = (props) => {

    const handleAccept = (e) => {
        e.preventDefault();
        props.confirmRide();
    }

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-bold my-2'>New Ride Available!</h3>
                {/* <i onClick={() => { props.setRidePopUpPanel(false)} } className="text-3xl ri-arrow-down-wide-fill"></i> */}
            </div>
            <div className='flex items-center justify-between rounded-lg p-3 bg-yellow-300'>
                <div className='flex items-center justify-center gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src={userImage} alt="person-image" />
                    <h2 className='text-base font-medium'>{props.ride?.user.fullname.firstname + ' ' + props.ride?.user.fullname.lastname}</h2>
                </div>
                {/* <h5 className='text-lg font-semibold'>Some kms away</h5> */}
            </div>
            <div className='w-full'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-map-pin-line"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Pickup</h3>
                        <p className='text-sm -mt-1 text-gray-800'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-fill"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Destination</h3>
                        <p className='text-sm -mt-1 text-gray-800'>{props.ride?.destination}</p>
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
            <div className='flex items-center gap-2'>
                <button
                    disabled={props.isLoading}
                    onClick={(e) => { handleAccept(e); }}
                    className='w-full  text-white bg-green-400 active:bg-green-600 font-semibold p-2 rounded-lg disabled:bg-green-300'>
                    {props.isLoading ? 'Accepting...' : 'Accept'}
                </button>
                <button
                    disabled={props.isLoading}
                    onClick={() => { props.setRidePopUpPanel(false) }}
                    className='w-full text-white bg-red-400 active:bg-red-600 font-semibold p-2 rounded-lg disabled:bg-red-300'>
                    Ignore
                </button>
            </div>
        </div>
    )
}

export default RidePopUp