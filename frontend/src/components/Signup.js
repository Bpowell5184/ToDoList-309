import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import './Login-Signup.css';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="large-heading">Sign Up</h1>
      <hr className="title-divider" />

      <input
        type="text"
        placeholder="Enter new username"
        className="text-input"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="text"
        placeholder="Enter new password"
        className="text-input"
        value={password}
        onChange={handlePasswordChange}
      />
      <div>
        <Link to="/login">
          <button className="button">Back to Login</button>
        </Link>
      </div>
      <div>
        <Link to="/login">
          <button className="button">Create Account</button>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
