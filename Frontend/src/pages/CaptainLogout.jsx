import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {

  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`)
      .then((res) => {
        if (res.status === 200) {
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