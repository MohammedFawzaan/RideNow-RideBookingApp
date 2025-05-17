import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectedWrapper = ({ children }) => {
    const { captain, setCaptain } = React.useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = React.useState(true);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/captains/login');
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if(response.status === 200) {
                setCaptain(response.data);
                setIsLoading(false);
            }
        }).catch(error => {
            console.log(error);
            localStorage.removeItem('token');
            navigate('/captains/login');
        });
    }, [token]);

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectedWrapper