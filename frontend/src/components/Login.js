import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate hook
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
    if (!username || !password) {
      setErrorMessage('Please enter a username and password.');
      return;
    }
  
    axios
      .post('http://localhost:8700/getuser', {
        username: username,
        password: password,
      })
      .then((response) => {
        if(response.data.token){
          localStorage.setItem('token', response.data.token);  
          setSuccessMessage('Success!');
          setErrorMessage(null);
          navigate('/todomain', { state: { username, password, token: response.data.token } });
        } else {
          setSuccessMessage(null);
          setErrorMessage(response.data.message || 'An error occurred.');
        }
      })
      .catch((error) => {
        console.error('Error logging in user:', error);
  
        if (error.response) {
          if (error.response.status === 404) {
            setErrorMessage('Username not found');
          } else if (error.response.status === 401) {
            setErrorMessage('Password not valid');
          } else {
            setErrorMessage('An error occurred. Please try again.');
          }
        } else if (error.request) {
          setErrorMessage('No response from server. Please check your connection.');
        } else {
          setErrorMessage('Request failed. Please try again.');
        }
  
        setSuccessMessage(null);
      });
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
}   ;


  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="large-heading">Log In</h1>
      <hr className="title-divider-login" />

      <input
        type="text"
        placeholder="Enter your username"
        className="text-input"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password" // Updated to "password" type for security
        placeholder="Enter your password"
        className="text-input"
        value={password}
        onChange={handlePasswordChange}
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div>
        <button className="button" onClick={handleLogin}>
          Log In
        </button>
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
