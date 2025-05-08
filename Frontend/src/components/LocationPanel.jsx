import React from 'react'

const LocationPanel = (props) => {
  // sample array for locations
  const locations = [
    "24B, Near Swiz cafe, Mehdipatnam, Hyderabad",
    "22A, Near Cafe of kapoor, Falaknuma, Hyderabad",
    "19D, Near Gopal Chat, Panjagutta, Hyderabad",
    "15C, Near Mandi King, King Koti, Hyderabad",
    "34E, Near Burger Man, Banjara Hills, Hyderabad",
  ]
  return (
    <div>
      {/* Sample data */}
      {
        locations.map((element, idx) => {
          return <div key={idx} onClick={() => { props.setVehiclePanel(true); props.setPanelOpen(false); }} className='flex gap-4 active:border-black border-2 p-2 rounded-xl border-white  items-center my-4 justify-start'>
            <h2 className='bg-[#eee] h-10 w-15 flex items-center justify-center rounded-full'><i className="ri-map-pin-2-fill"></i></h2>
            <h4 className='font-medium'>{element}</h4>
          </div>
        })
      }
    </div>
  )
}

export default LocationPanel