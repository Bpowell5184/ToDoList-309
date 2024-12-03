import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '.././assets/logo.png';
import calendar_view_icon from '.././assets/calendar_view_icon.png';
import axios from 'axios';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  const [data, setData] = useState(null); // Store user data
  const [errorMessage, setErrorMessage] = useState(null);

  const { state } = useLocation();
  const { username, password } = state || {};

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (username && password) {
      axios
        .post('http://localhost:8700/getuser', { username, password })
        .then((response) => {
          if (response.data.message === 'User not found') {
            setData(null);
            setErrorMessage('User not found');
          } else if (response.data.message.includes('error')) {
            setData(null);
            setErrorMessage('Server-side error');
          } else {
            setData(response.data.user); // Use the user data directly
            setErrorMessage(null);
          }
        })
        .catch(() => setErrorMessage('An error occurred while fetching the user data.'));
    }
  }, [username, password]);
  
  useEffect(() => {
    if (data?._id) {
      axios
        .get(`http://localhost:8700/tasks/${data._id}`)
        .then((response) => {
          console.log(response.data)
          //setTasks(response.data.tasks || []); // Default to an empty array if no tasks
        })
        .catch((error) => {
          // Only set error message if it's not a 404
          if (error.response && error.response.status !== 404) {
            setErrorMessage('An error occurred while fetching the user data.');
          }
          // 404 means user has no tasks (yet)
        });
    }
  }, [data?._id]);

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      calendarDays.push(day);
    }

    setDaysInMonth(calendarDays);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  return (
    <div className="calendar-container">
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </h2>
        <button onClick={handlePrevMonth}>Previous</button>
        <button onClick={handleNextMonth}>Next</button>
        <Link to="/todomain" state={{ username, password }}>
          <img
            src={calendar_view_icon}
            alt="calendar_view_icon"
            className="calendar-view-icon"
          />
        </Link>
      </header>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {daysInMonth.map((day, index) => (
          <div key={index} className="day-cell">
            {day && <div className="day-number">{day}</div>}
          </div>
        ))}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Calendar;
