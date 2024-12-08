// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const registerUser = async () => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/register/customer/`, formData);
            alert('OTP sent to email. Please verify to activate your account.');
            navigate(`/verify-otp/${data.id}`); // Assuming you want to pass the user ID via URL
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div>
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
            <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" type="password" />
            <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number" />
            <button onClick={registerUser}>Register</button>
        </div>
    );
};

export default Register;
