import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import RideNowIcon from '../assets/RideNowIcon.png'
import { UserDataContext } from '../context/UserContext'
import { toast } from 'react-toastify';

const UserSignup = () => {
  const [fistname, setFistname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

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

    if (!fistname || !lastname || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const newUser = {
        fullname: {
          firstname: fistname,
          lastname: lastname
        },
        email: email,
        password: password
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if (response.status === 201) {
        const data = await response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        toast.success('Account created successfully');
        navigate('/home');
      }
    } catch (err) {
      toast.error('Registration failed');
    }

    setFistname('');
    setLastname('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='mb-5 w-36' src={RideNowIcon} alt="ride-logo" />
        <h1 className='text-3xl text-center my-5 text-[#10b461] font-medium'>User SignUp</h1>
        <form onSubmit={(e) => handleSubmit(e)} action="">

          <h3 className='text-xl mb-2'>Your Name</h3>
          <input
            className='border-rounded mt-5 mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={fistname}
            onChange={(e) => setFistname(e.target.value)}
            type="text"
            placeholder='firstname'
          />
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            type="text"
            placeholder='lastname'
          />
          <h3 className='text-xl mb-2'>Your Email</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder='email@example.com'
          />
          <h3 className='text-xl mb-2'>Create Password</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='password'
          />
          <button className='border-rounded mb-7 bg-[#111] text-white font-semibold px-4 py-2 w-full text-lg'>Create Account</button>
        </form>
        <p className='text-center'>Already have an Account? <Link to='/users/login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <Link to='/captains/signup' className='block text-center w-full border-rounded mb-7 bg-[#10b461] text-white font-semibold px-4 py-2 text-lg'>Register as Captain</Link>
      </div>
    </div>
  )
}

export default UserSignup