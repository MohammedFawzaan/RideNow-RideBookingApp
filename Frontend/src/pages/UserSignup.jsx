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
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  React.useEffect(() => {
    if (user.token) {
      navigate('/home');
    }
  }, [user, navigate]);

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

    setIsLoading(true);
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
        setUser({
          ...data.user,
          token: "cookie",
          role: "user"
        });

        toast.success('Account created successfully');
        navigate('/home');
      }
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }

    setFistname('');
    setLastname('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img onClick={() => navigate('/')} className='mb-5 w-36 cursor-pointer' src={RideNowIcon} alt="ride-logo" />
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
          <button disabled={isLoading} className='border-rounded bg-[#111] text-white font-semibold px-4 py-2 w-full text-lg disabled:opacity-50'>{isLoading ? 'Creating Account...' : 'Create Account'}</button>
        </form>
        <button
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_BASE_URL}/users/auth/google`;
            // toast.success('Account created successfully');
          }}
          className="my-5 w-full flex items-center justify-center gap-5 bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 text-lg font-medium hover:shadow-md transition duration-150">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
        <p className='text-center'>Already have an Account? <Link to='/users/login' className='text-blue-600 my-5'>Login here</Link></p>
      </div>
      <div>
        <Link to='/captains/signup' className='block text-center w-full border-rounded my-5 bg-[#10b461] text-white font-semibold px-4 py-2 text-lg'>Register as Captain</Link>
      </div>
    </div>
  )
}

export default UserSignup