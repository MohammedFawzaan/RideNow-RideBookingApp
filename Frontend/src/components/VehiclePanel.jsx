import React from 'react'
import CarImage from '../assets/CarImage.jpg'
import PremiumCarImage from '../assets/PremiumCarImage.jpeg'
import MotoImage from '../assets/MotoImage.webp'
import AutoImage from '../assets/AutoImage.webp'

const VehiclePanel = (props) => {
    return (
        <div>
            <div>
                <i onClick={() => props.setVehiclePanel(false)} className="text-3xl ri-arrow-down-wide-fill"></i>
                <h3 className='text-2xl font-semibold mb-3'>Choose Your Vehicle</h3>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); }} className='w-full mb-2 flex items-center justify-between border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={CarImage} alt="Car-Icon" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-fill"></i>4</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='text-2xl font-semibold text-black'>{props.fare.car}₹</h2>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); }} className='w-full mb-2 flex items-center justify-between border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={MotoImage} alt="Moto-Icon" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>UberMoto <span><i className="ri-user-fill"></i>1</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='text-2xl font-semibold text-black'>{props.fare.moto}₹</h2>
            </div>
            <div onClick={() => { props.setVehiclePanel(false); props.setConfirmRidePanel(true); }} className='w-full mb-2 flex items-center justify-between border-2 active:border-black rounded-xl p-3'>
                <img className='h-14' src={AutoImage} alt="Auto-Icon" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>UberAuto <span><i className="ri-user-fill"></i>3</span></h4>
                    <h5 className='font-medium text-xm text-gray-600'>few mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                <h2 className='text-2xl font-semibold text-black'>{props.fare.auto}₹</h2>
            </div>
        </div>
    )
}

export default VehiclePanel