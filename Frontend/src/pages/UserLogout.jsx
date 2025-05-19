import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if(res.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/users/login');
      }
    }).catch(err => {
      console.log(err)
    });
  }, []);

  return (
    <div></div>
  )
}

export default UserLogout