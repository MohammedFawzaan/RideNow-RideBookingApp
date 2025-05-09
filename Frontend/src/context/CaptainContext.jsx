import React, { useEffect } from 'react'
export const CaptainDataContext = React.createContext()

const CaptainContext = ({ children }) => {

  const [captain, setCaptain] = React.useState({
    email: '',
    fullname: {
      firstname: '',
      lastname: ''
    },
    token: null,
    role: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      try {
        setCaptain((prev) => ({
          ...prev,
          token: token,
          role: role,
        }));
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
  }, []);

  return (
    <div>
      <CaptainDataContext.Provider value={{ captain, setCaptain }}>
        {children}
      </CaptainDataContext.Provider>
    </div>
  )
}

export default CaptainContext