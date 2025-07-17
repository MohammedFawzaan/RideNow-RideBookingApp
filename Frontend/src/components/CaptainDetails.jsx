import { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import captainIcon from '../assets/captainImage.webp'

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div className='flex flex-row items-center justify-between w-full'>
      <div className='flex items-center'>
        <img
          className='h-10 w-10 rounded-full object-cover'
          src={captainIcon}
          alt="driver-image"
        />
        <h4 className='ml-2 capitalize font-medium'>
          {(captain?.fullname?.firstname || 'Captain') + ' ' + (captain?.fullname?.lastname || '')}
        </h4>
      </div>
      <div className='ml-5'>
        <h4 className='capitalize font-medium'>
          Plate - {(captain?.vehicle?.plate || 'Plate')}
        </h4>
      </div>
      <div className='ml-5 flex items-center'>
        <span className='h-3 w-3 rounded-full bg-green-500 mr-2'></span>
        <h4 className='capitalize font-medium'>Online</h4>
      </div>
    </div>
  )
}

export default CaptainDetails