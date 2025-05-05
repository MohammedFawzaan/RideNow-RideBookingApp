import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const CaptainSignup = () => {

  const [firstname, setFirstname] = React.useState('');
   const [lastname, setLastname] = React.useState('');
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [captaindata, setCaptaindata] = React.useState({});
 
   const handleSubmit = (e) => { 
     e.preventDefault();
     setCaptaindata({
       fullName: {
         firstname: firstname,
         lastname: lastname,
       },
       email: email,
       password: password
     });
     setFirstname('');
     setLastname('');
     setEmail('');
     setPassword('');
   }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-28 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
        <form onSubmit={(e) => handleSubmit(e)} action="">
          
          <h3 className='text-xl mb-2'>What's Our's Captains Name</h3>
          <input
            className='border-rounded mt-5 mb-7 bg-white px-4 py-2 border w-full text-lg placeholder:text-size-sm'
            required
            value={firstname}
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
          <h3 className='text-xl mb-2'>Enter Your Email</h3>
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
          <button className='border-rounded mb-7 bg-[#111] text-white font-semibold px-4 py-2 w-full text-lg'>SignUp</button>
        </form>
        <p className='text-center'>Already have an Account? <Link to='/users/login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <Link to='/users/signup' className='flex align-center w-full border-rounded mb-7 bg-black text-white font-semibold px-4 py-2 text-lg'>SignUp as User</Link>
      </div>
    </div>
  )
}

export default CaptainSignup