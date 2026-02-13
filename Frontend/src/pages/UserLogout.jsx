import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';

const UserLogout = () => {

  const navigate = useNavigate();
<<<<<<< HEAD
  const { setUser } = React.useContext(UserDataContext);
=======
>>>>>>> 0079f1a2653a70962042edd1eeb074cf7cee5705
  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`)
      .then((res) => {
        if (res.status === 200) {
<<<<<<< HEAD
          setUser({
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