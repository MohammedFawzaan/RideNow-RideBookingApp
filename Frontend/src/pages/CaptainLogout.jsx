import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogout = () => {

  const navigate = useNavigate();
<<<<<<< HEAD
  const { setCaptain } = React.useContext(CaptainDataContext);
=======
>>>>>>> 0079f1a2653a70962042edd1eeb074cf7cee5705
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`)
      .then((res) => {
        if (res.status === 200) {
<<<<<<< HEAD
          setCaptain({
            email: '',
            fullname: {
              firstname: '',
              lastname: ''
            },
            token: null,
            role: null
          });
=======
>>>>>>> 0079f1a2653a70962042edd1eeb074cf7cee5705
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