import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import RideNowIcon from '../assets/RideNowIcon.png'
import { UserDataContext } from '../context/UserContext'
import { toast } from 'react-toastify';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { user, setUser } = React.useContext(UserDataContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            if (role === 'user') navigate('/home');
            if (role === 'captain') navigate('/captain-home');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

            if (response.status === 200) {
                const data = response.data;
                const role = data.role;

                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', role);
                toast.success('Login successful!');

                // Clear inputs and navigate
                setEmail('');
                setPassword('');
                navigate('/home');
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                if (message.includes('Incorrect password')) {
                    toast.error('Incorrect password');
                } else if (message.includes('User not found') || message.includes('No user')) {
                    toast.error('Email not found');
                } else {
                    toast.error(message); // fallback for other custom messages
                }
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        }
    };


    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='mb-5 w-36' src={RideNowIcon} alt="ride-logo" />
                <h1 className='text-3xl text-center my-6 text-[#10b461] font-medium'>User Login</h1>
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
                <p className='text-center'>New here? <Link to='/users/signup' className='text-blue-600'>Create new Account</Link></p>
            </div>
            <div>
                <Link to='/captains/login' className='block text-center w-full border-rounded mb-7 bg-[#10b461] text-white font-semibold px-4 py-2 text-lg'>Login as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin