import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Add useNavigate hook
import axios from 'axios';
import logo from '.././assets/logo.png';
import './Login-Signup.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Send POST request to login
    axios
      .post('http://localhost:8700/getuser', {
        username: username,
        password: password
      })
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data.message.includes('User retrieved successfully')) {
          setSuccessMessage('Success!');
          setErrorMessage(null);
          navigate('/todomain', { state: { username, password } });
        } else {
          setSuccessMessage(null);
          setErrorMessage(response.data.message || 'An error occurred.');
        }
      })
      .catch((error) => {
        console.error('Error logging in user:', error);
        setSuccessMessage(null);
        setErrorMessage('An error occurred while logging in.');
      });
  };

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="large-heading">Log In</h1>
      <hr className="title-divider" />

      <input
        type="text"
        placeholder="Enter your username"
        className="text-input"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"  // Updated to "password" type for security
        placeholder="Enter your password"
        className="text-input"
        value={password}
        onChange={handlePasswordChange}
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div>
        <button className="button" onClick={handleLogin}>Log In</button>
      </div>
      <div>
        <Link to="/signup">
          <button className="button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
