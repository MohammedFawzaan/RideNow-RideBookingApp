import React from 'react'
import CarImage from '../assets/CarImage.jpg'
import MotoImage from '../assets/MotoImage.webp'
import AutoImage from '../assets/AutoImage.webp'

const VehiclePanel = (props) => {
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-semibold mb-3'>Choose Your Vehicle</h3>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); props.selectVehicle('car'); props.setVehicleImage(CarImage); }} className='w-full mb-2 flex items-center cursor-pointer border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={CarImage} alt="Car-Icon" />
                <div className='ml-5 w-1/2'>
                    <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-fill"></i>4</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='fixed right-5 text-2xl font-semibold text-black'>₹{props.fare.car}</h2>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); props.selectVehicle('moto'); props.setVehicleImage(MotoImage); }} className='w-full mb-2 flex items-center cursor-pointer border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={MotoImage} alt="Moto-Icon" />
                <div className='ml-5 w-1/2'>
                    <h4 className='font-medium text-base'>UberMoto <span><i className="ri-user-fill"></i>1</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='fixed right-5 text-2xl font-semibold text-black'>₹{props.fare.moto}</h2>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); props.selectVehicle('auto'); props.setVehicleImage(AutoImage); }} className='w-full mb-2 flex items-center cursor-pointer border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={AutoImage} alt="Auto-Icon" />
                <div className='ml-5 w-1/2'>
                    <h4 className='font-medium text-base'>UberAuto <span><i className="ri-user-fill"></i>3</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='fixed right-5 text-2xl font-semibold text-black'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel