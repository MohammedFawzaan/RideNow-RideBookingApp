import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: '',
        },
        token: null,
        role: null,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`);
                if (response.status === 200) {
                    setUser({
                        ...response.data,
                        token: "cookie",
                        role: 'user'
                    });
                }
            } catch (err) {
                console.log('No active user session');
                setUser({
                    email: '',
                    fullname: {
                        firstname: '',
                        lastname: '',
                    },
                    token: null,
                    role: null,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <UserDataContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;