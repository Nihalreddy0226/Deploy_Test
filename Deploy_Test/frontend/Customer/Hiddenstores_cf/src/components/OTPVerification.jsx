import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { userId } = useParams();

    const verifyOtp = async () => {
        const payload = { user_id: userId, otp: otp };
        console.log('Sending OTP verification request with:', payload); // Log the payload to inspect it

        try {
            await axios.post(`${API_BASE_URL}/verify-otp/`, payload);
            alert('Verification successful!');
            navigate('/login');  // Redirect to login page after successful verification
        } catch (error) {
            console.error('OTP verification failed:', error);
            console.log('Failed request data:', error.response.data); // Log specific error details from the server
        }
    };

    return (
        <div>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
            <button onClick={verifyOtp}>Verify OTP</button>
        </div>
    );
};

export default OTPVerification;
