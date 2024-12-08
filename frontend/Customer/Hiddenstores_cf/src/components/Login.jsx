// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const loginUser = async () => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/customer/login/`, credentials);
            login(data);
            alert('Login successful!');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <input name="email" value={credentials.email} onChange={handleInputChange} placeholder="Email" />
            <input name="password" value={credentials.password} onChange={handleInputChange} placeholder="Password" type="password" />
            <button onClick={loginUser}>Login</button>
        </div>
    );
};

export default Login;
