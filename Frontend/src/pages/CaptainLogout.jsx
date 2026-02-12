import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/captains/login');
      }
    }).catch(err => {
      console.log(err)
    });
  }, []);

  return (
    <div></div>
  )
}

export default CaptainLogout