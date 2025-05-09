import React, { useEffect, useState, createContext } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        fullName: {
            firstname: '',
            lastname: '',
        },
        token: null,
        role: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            try {
                setUser((prev) => ({
                    ...prev,
                    token: token,
                    role: role,
                }));
            } catch (err) {
                console.error('Invalid token');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }
        }
    }, []);

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;