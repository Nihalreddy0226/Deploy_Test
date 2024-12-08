import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import OTPVerification from './components/OTPVerification';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp/:userId" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          {/* You can add more routes here */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
