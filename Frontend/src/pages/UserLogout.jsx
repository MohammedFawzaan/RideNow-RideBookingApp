import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';

const UserLogout = () => {

  const navigate = useNavigate();
  const { setUser } = React.useContext(UserDataContext);
  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`)
      .then((res) => {
        if (res.status === 200) {
          setUser({
            email: '',
            fullname: {
              firstname: '',
              lastname: ''
            },
            token: null,
            role: null
          });
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