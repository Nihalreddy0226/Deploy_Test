// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, user: null });

    const login = (data) => {
        setAuth({ token: data.token, user: data.user });
        localStorage.setItem('token', data.token); // Persist token for session recovery
    };

    const logout = () => {
        setAuth({ token: null, user: null });
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
