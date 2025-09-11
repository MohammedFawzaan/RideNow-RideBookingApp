import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import RideNowIcon from '../assets/RideNowIcon.png'
import { CaptainDataContext } from '../context/CaptainContext'
import { toast } from 'react-toastify';

const CaptainSignup = () => {
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [vehicleColor, setVehicleColor] = React.useState('');
  const [vehiclePlate, setVehiclePlate] = React.useState('');
  const [vehicleCapacity, setVehicleCapacity] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState('');

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
      const newCaptain = {
        fullname: {
          firstname: firstname,
          lastname: lastname,
        },
        email: email,
        password: password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType,
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptain);

      if (response.status === 201) {
        const data = await response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        toast.success('Account created successfully');
        navigate('/captain-home');
      }
    } catch (err) {
      toast.error('Registration failed');
    }

    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
    setVehicleColor('');
    setVehicleCapacity('');
    setVehiclePlate('');
    setVehicleType('');
  };


  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img onClick={() => navigate('/')} className='mb-5 w-36 cursor-pointer' src={RideNowIcon} alt="ride-logo" />
        <h1 className='text-3xl text-center my-6 text-orange-500 font-medium'>Captain's SignUp</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h3 className='text-xl mb-2'>Our Captain's Name</h3>
          <input
            className='border-rounded mt-5 mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
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
          <h2 className='text-center font-bold text-2xl mb-3'>Vehicle Details</h2>
          <h3 className='text-xl mb-2'>Vehicle Type</h3>
          <select name="type" id="type"
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}>
            <option value="" disabled>What's Your Vehicle</option>
            <option value="car">Car</option>
            <option value="auto">Auto</option>
            <option value="motor cycle">Motor Cycle</option>
          </select>
          <h3 className='text-xl mb-2'>Vehicle Capacity</h3>
          <select name="capacity" id="capacity"
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}>
            <option value="" disabled>How Many Passengers</option>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>
          <h3 className='text-xl mb-2'>Vehicle Color</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            type="text"
            placeholder='color of your vehicle'
          />
          <h3 className='text-xl mb-2'>Vehicle Plate</h3>
          <input
            className='border-rounded mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            type="text"
            placeholder='vehicle number'
          />
          <button className='border-rounded my-5 bg-[#111] text-white font-semibold px-4 py-2 w-full text-lg'>Create Your Account</button>
        </form>
        <p className='text-center m'>Already have an Account? <Link to='/captains/login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <Link to='/users/signup' className='block text-center w-full border-rounded my-5 bg-orange-500 text-white font-semibold px-4 py-2 text-lg'>Register as User</Link>
      </div>
    </div>
  )
}

export default CaptainSignup