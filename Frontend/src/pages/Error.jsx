import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
            <p className="text-xl text-gray-600 mb-8">Something went wrong. We're working on fixing it.</p>
            <Link to="/home" className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Go Home
            </Link>
        </div>
    );
};

export default Error;
