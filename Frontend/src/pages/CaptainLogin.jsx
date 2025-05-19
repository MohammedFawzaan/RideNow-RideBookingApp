import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RideNowIcon from '../assets/RideNowIcon.png'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'user') navigate('/home');
      if (role === 'captain') navigate('/captain-home');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const captainData = {
        email: email,
        password: password
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData);

      if (response.status === 200) {
        const data = await response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        toast.success('Login successful');
        navigate('/captain-home');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Something went wrong');
      }
    }

    setEmail('');
    setPassword('');
  };


  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='mb-5 w-36' src={RideNowIcon} alt="ride-logo" />
        <h1 className='text-3xl text-center my-5 text-orange-500 font-medium'>Captain's Login</h1>
        <form onSubmit={(e) => handleSubmit(e)} action="">
          <h3 className='text-xl mb-2'>What's Your Email</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder='email@example.com'
          />
          <h3 className='text-xl mb-2'>Enter Password</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='password'
          />
          <button className='border-rounded mb-7 bg-[#111] text-white font-semibold px-4 py-2 w-full text-lg'>Login</button>
        </form>
        <p className='text-center'>New here? <Link to='/captains/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>
      <div>
        <Link to='/users/login' className='block text-center border-rounded mb-7 bg-orange-500 text-white font-semibold px-4 py-2 text-lg'>Login as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin