import React from 'react'

const Loader = ({ message }) => {
    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black mb-3"></div>
            {message && <p className="text-gray-600 font-medium text-sm animate-pulse">{message}</p>}
        </div>
    )
}

export default Loader
