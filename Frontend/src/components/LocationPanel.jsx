import React from 'react';

const LocationPanel = ({ suggestions = [], onSuggestionClick, setPanelOpen, setVehiclePanel }) => {
  const handleClick = (location) => {
    if (onSuggestionClick)
      onSuggestionClick(location);
  };

  return (
    <div className='space-y-3'>
      {suggestions.length > 0 &&
        suggestions.map((suggestion, idx) => (
          <div
            key={suggestion.place_id || idx}
            onClick={() => handleClick(suggestion)}
            className='flex gap-4 p-3 rounded-xl border-2 border-white hover:border-black transition-colors duration-200 cursor-pointer items-center'>
            <div className='bg-gray-100 h-10 w-10 cursor:pointer flex items-center justify-center rounded-full text-lg text-gray-700'>
              <i className="ri-map-pin-2-fill"></i>
            </div>
            <span className='font-medium'>{suggestion.description}</span>
          </div>
        ))}
    </div>
  );
};

export default LocationPanel;