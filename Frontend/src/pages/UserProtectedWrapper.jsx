import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import Loader from '../components/Loader';

const UserProtectedWrapper = ({ children }) => {
  const { user, setUser } = React.useContext(UserDataContext);
  const [isLoading, setIsLoading] = React.useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/users/login');
    }
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 200) {
        setUser(response.data);
        setIsLoading(false);
      }
    }).catch(err => {
      console.log(err);
      localStorage.removeItem('token');
      navigate('/users/login');
    });
  }, [token]);

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export default UserProtectedWrapper