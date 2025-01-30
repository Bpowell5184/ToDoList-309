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

  // eslint-disable-next-line no-unused-vars
  const [tasks, setTasks] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});

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
            setData(response.data.user);
            setErrorMessage(null);
          }
        })
        .catch(() =>
          setErrorMessage('An error occurred while fetching the user data.'),
        );
    }
  }, [username, password]);

  useEffect(() => {
    if (data?._id) {
      axios
        .get(`http://localhost:8700/tasks/${data._id}`)
        .then((response) => {
          const fetchedTasks = response.data.tasks || [];

          const taskMap = {};
          fetchedTasks.forEach((task) => {
            if (task.task_due_date) {
              const taskDate = new Date(task.task_due_date);

              if (
                taskDate.getFullYear() === currentDate.getFullYear() &&
                taskDate.getMonth() === currentDate.getMonth()
              ) {
                const dateKey = taskDate.getDate();

                if (!taskMap[dateKey]) {
                  taskMap[dateKey] = [];
                }
                taskMap[dateKey].push(task);
              }
            }
          });

          setTasksByDate(taskMap);
          setTasks(fetchedTasks);
        })
        .catch((error) => {
          if (error.response && error.response.status !== 404) {
            setErrorMessage('An error occurred while fetching the user data.');
          }
        });
    }
  }, [data?._id, currentDate]);

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
      <div className='header-calendar'>
        <img src={logo} alt="Logo" className="logo" />
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </h2>
        <button className="next-previous-button" onClick={handlePrevMonth}>
          <div className="next-previous-button-text">Previous</div>
        </button>
        <button className="next-previous-button" onClick={handleNextMonth}>
          <div className="next-previous-button-text">Next</div>
        </button>
        <Link to="/todomain" state={{ username, password }}>
          <img
            src={calendar_view_icon}
            alt="calendar_view_icon"
            className="calendar-view-icon"
          />
        </Link>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

{daysInMonth.map((day, index) => {
  // Determine if the date is in the past
  const isPastDate =
    day &&
    new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      key={index}
      className={`day-cell ${isPastDate ? 'past-date' : ''}`}
    >
      {day && (
        <>
          <div className="day-number">{day}</div>
          {tasksByDate[day] && (
            <div className="day-tasks">
              {tasksByDate[day].map((task, taskIndex) => {
                // Check if the task is overdue and incomplete
                const taskDate = new Date(task.task_due_date);
                const isOverdue = taskDate < new Date() && !task.task_completed;

                return (
                  <div
                    key={taskIndex}
                    className="task-item"
                    style={{
                      color: isOverdue ? 'red' : task.task_completed ? 'green' : 'black',
                    }}
                  >
                    {task.task_name}{' '}
                    {task.task_completed ? (
                      <span
                        role="img"
                        aria-label="Completed"
                        style={{ marginLeft: '5px' }}
                      >
                        ✅
                      </span>
                    ) : isOverdue ? (
                      <span
                        role="img"
                        aria-label="Overdue"
                        style={{ marginLeft: '5px', color: 'red' }}
                      >
                        ❌
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
})}


      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Calendar;
