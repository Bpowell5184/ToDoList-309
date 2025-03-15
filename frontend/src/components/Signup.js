import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import './Login-Signup.css';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSignup = () => {
    if (!username || !password || !name) {
      setErrorMessage('Please enter a username and password and name.');
      return;
    }
    if (username.length <= 4) {
      setErrorMessage('Username must be 5 or more characters.');
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    if (
      password.length <= 5 ||
      !specialCharRegex.test(password) ||
      !upperCaseRegex.test(password) ||
      !lowerCaseRegex.test(password)
    ) {
      setErrorMessage(
        'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, and a special character.',
      );
      return;
    }
    axios
      .post('https://backend-6hjp.onrender.com/adduser', {
        username: username,
        name: name,
        password: password,
      })
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          setSuccessMessage('Account created successfully!');
          setErrorMessage(null);
        } else {
          setSuccessMessage(null);
          setErrorMessage(response.data.message || 'An error occurred.');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        if (error.response) {
          if (error.response.status === 500) {
            setErrorMessage('Username Already taken');
          } else {
            setErrorMessage('An error occurred. Please try again.');
          }
        } else if (error.request) {
          setErrorMessage(
            'No response from server. Please check your connection.',
          );
        } else {
          setErrorMessage('Request failed. Please try again.');
        }
      });
  };

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="large-heading">Sign Up</h1>
      <hr className="title-divider-login" />

      <input
        type="text"
        placeholder="Enter new username"
        className="text-input"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        placeholder="Enter new password"
        className="text-input"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        type="text"
        placeholder="Enter your name"
        className="text-input"
        value={name}
        onChange={handleNameChange}
      />

      {/* Display success or error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div>
        <Link to="/login">
          <button className="button">Back to Login</button>
        </Link>
      </div>
      <div>
        <button className="button" onClick={handleSignup}>
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Signup;
