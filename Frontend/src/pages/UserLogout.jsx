import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

  const navigate = useNavigate();
  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`)
      .then((res) => {
        if (res.status === 200) {
          navigate('/users/login');
        }
      }).catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div></div>
  )
}

export default UserLogout