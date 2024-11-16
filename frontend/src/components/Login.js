import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import './Login-Signup.css';

function Login() {
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
        type="text"
        placeholder="Enter your password"
        className="text-input"
        value={password}
        onChange={handlePasswordChange}
      />
      <div>
        <Link to="/todomain">
          <button className="button">Log In</button>
        </Link>
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
