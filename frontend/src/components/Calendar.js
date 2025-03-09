import React, { useState, useEffect } from 'react';
import './Calendar.css';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Add AnimatePresence for exit animation
import logo from '.././assets/logo.png';
import calendar_view_icon from '.././assets/calendar_view_icon.png';
import Overlay from './'; // Assuming you have an Overlay component
import axios from 'axios';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [tasks, setTasks] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useLocation();
  const { username, password } = state || {};

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (username && password) {
      setIsLoading(true); // Start loading
      axios
        .post('http://todo.dylanwatanabe.com:8700/getuser', {
          username,
          password,
        })
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
        )
        .finally(() => setIsLoading(false)); // Stop loading
    }
  }, [username, password]);

  useEffect(() => {
    if (data?._id) {
      setIsLoading(true); // Start loading
      axios
        .get(`http://todo.dylanwatanabe.com:8700/tasks/${data._id}`)
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
        })
        .finally(() => setIsLoading(false)); // Stop loading
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
      <div className="content-wrapper">
        <div className="calendar-header">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="month-title">
            {currentDate.toLocaleString('default', { month: 'long' })}{' '}
            {currentDate.getFullYear()}
          </h2>
          <button className="nav-button" onClick={handlePrevMonth}>
            <span className="nav-button-text">Previous</span>
          </button>
          <button className="nav-button" onClick={handleNextMonth}>
            <span className="nav-button-text">Next</span>
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
            const isPastDate =
              day &&
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <
                new Date().setHours(0, 0, 0, 0);

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
                          const taskDate = new Date(task.task_due_date);
                          const isOverdue =
                            taskDate < new Date() && !task.task_completed;

                          return (
                            <div
                              key={taskIndex}
                              className="task-item"
                              style={{
                                color: isOverdue
                                  ? 'red'
                                  : task.task_completed
                                    ? 'green'
                                    : 'black',
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

      {/* Loading Overlay with Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Overlay isOpen={isLoading} onClose={() => {}}>
              <div className="overlay-item-container">
                <div className="overlay-text-container">Loading...</div>
              </div>
            </Overlay>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
