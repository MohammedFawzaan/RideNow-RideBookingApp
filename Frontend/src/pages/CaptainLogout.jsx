import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogout = () => {

  const navigate = useNavigate();
  const { setCaptain } = React.useContext(CaptainDataContext);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`)
      .then((res) => {
        if (res.status === 200) {
          setCaptain({
            email: '',
            fullname: {
              firstname: '',
              lastname: ''
            },
            token: null,
            role: null
          });
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