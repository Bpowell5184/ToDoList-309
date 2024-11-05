import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="calendar-container">
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={handlePrevMonth}>Previous</button>
        <button onClick={handleNextMonth}>Next</button>
      </header>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}

        {daysInMonth.map((day, index) => (
        <div key={index} className="day-cell">
            {day && <div className="day-number">{day}</div>}
        </div>
        ))}
      </div>

      <Link to="/todomain">
        <button>Back To Main</button>
      </Link>
    </div>

  );
};

export default Calendar;
