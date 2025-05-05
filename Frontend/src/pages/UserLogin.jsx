import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userdata, setUserdata] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserdata({
            email: email,
            password: password
        });
        console.log(userdata);
        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-28 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
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
                <Link to='/captains/login' className='flex align-center w-full border-rounded mb-7 bg-[#10b461] text-white font-semibold px-4 py-2 text-lg'>Sign-in as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin