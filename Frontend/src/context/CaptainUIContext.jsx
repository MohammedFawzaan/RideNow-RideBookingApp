import React, { createContext, useState } from 'react';

export const CaptainUIContext = createContext();

export const CaptainUIProvider = ({ children }) => {
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  return (
    <CaptainUIContext.Provider value={{ confirmRidePopUpPanel, setConfirmRidePopUpPanel }}>
      {children}
    </CaptainUIContext.Provider>
  );
};