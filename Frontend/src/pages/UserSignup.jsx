import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LogoImage from '../assets/logo.png'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [fistname, setFistname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    const newUser = {
      fullname : {
        firstname: fistname,
        lastname: lastname
      },
      email: email,
      password: password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if(response.status === 201) {
      const data = await response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }
    setFistname('');
    setLastname('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-28 mb-10' src={LogoImage} alt="Uber" />
        <form onSubmit={(e) => handleSubmit(e)} action="">
          
          <h3 className='text-xl mb-2'>Captain's Name</h3>
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
        <Link to='/captains/signup' className='flex align-center w-full border-rounded mb-7 bg-[#10b461] text-white font-semibold px-4 py-2 text-lg'>Register as Captain</Link>
      </div>
    </div>
  )
}

export default UserSignup