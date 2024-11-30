import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import logo from '.././assets/logo.png';
import './Login-Signup.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null); // State to store the response data

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  useEffect(() => {
    // Perform an axios GET request when the component mounts
    axios
      .get('http://localhost:8700/users') // Replace with your endpoint
      .then((response) => {
        setData(response.data); // Store the data in state
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Handle errors
      });
  }, []); // Empty dependency array ensures this runs only once

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
        type="password" // Updated to "password" type for security
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

      {/* New Div with Axios Data */}
      <div className="data-container">
        <h3>Fetched Data</h3>
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre> // Display fetched data
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Login;
