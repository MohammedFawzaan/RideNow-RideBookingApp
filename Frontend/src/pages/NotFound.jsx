import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='h-screen flex flex-col items-center justify-center text-center p-4'>
            <h1 className='text-6xl font-bold mb-4'>404</h1>
            <p className='text-xl mb-8'>Oops! The page you're looking for doesn't exist.</p>
            <Link to='/home' className='bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition'>
                Go Back Home
            </Link>
        </div>
    )
}

export default NotFound
