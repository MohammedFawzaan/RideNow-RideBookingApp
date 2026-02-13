import React, { useEffect } from 'react';
import axios from 'axios';
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

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`);
        if (response.status === 200) {
          setCaptain({
            ...response.data,
            token: "cookie",
            role: 'captain'
          });
        }
      } catch (err) {
        console.log('No active captain session');
        setCaptain({
          email: '',
          fullname: {
            firstname: '',
            lastname: ''
          },
          token: null,
          role: null
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <CaptainDataContext.Provider value={{ captain, setCaptain, isLoading }}>
        {children}
      </CaptainDataContext.Provider>
    </div>
  )
}

export default CaptainContext