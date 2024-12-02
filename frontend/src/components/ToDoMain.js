import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import sort_carrot from '.././assets/sort_carrot.png';
import filter_icon from '.././assets/filter_icon.png';
import list_view_icon from '.././assets/list_view_icon.png';
import trash_icon from '.././assets/trash_icon.png';
import options from '.././assets/options.png';
import Overlay from './';
import axios from 'axios';
import './ToDoMain.css';

function ToDoMain() {
  const [Points_Day] = useState('0');
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [taskDateComparitor, setTaskDateComparitor] = useState('Time?');
  const [tasks, setTasks] = useState([]); // State to manage all tasks
  const [Title, setTitle] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [Points, setPoints] = useState('');
  const [Priority, setPriority] = useState('');
  const [Description, setDescription] = useState('');
  const [data, setData] = useState(null); // Store user data
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle changes in input fields
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleTaskDateChange = (event) => setTaskDate(event.target.value);
  const handlePointsChange = (event) => setPoints(event.target.value);
  const handlePriorityChange = (event) => setPriority(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const resetAddTaskState = () => {
    setTaskDate('');
    setDescription('');
    setPoints('');
    setPriority('');
    setTitle('');
    toggleOverlayAddTask();
  };

  // Toggle overlay visibility
  const toggleOverlayAddTask = () => setIsOpenAddTask(!isOpenAddTask);
  const toggleOverlayFilter = () => setIsOpenFilter(!isOpenFilter);

// Add a new task
async function handleAddTask() {
  try {
    const response = await axios.post('http://localhost:8700/tasks', {
      userid: data?._id,
      task_name: Title,
      task_due_date: '2024-11-15T22:25:30.000+00:00',
      task_description: 'None',
      task_tags: []
    });

    console.log('Response:', response.data);

    if (response.data.message.includes('Task retrieved successfully')) {
      setErrorMessage(null);

      const newTask = {
        title: Title,
        taskdate: TaskDate,
        points: Points,
        priority: Priority,
        description: Description,
        task_name: Title,
      };

      // Update the tasks list with the new task
      //setTasks(prevTasks => [...prevTasks, newTask]);
      
    } else {
      setErrorMessage(response.data.message || 'An error occurred upon adding a task.');
    }
  } catch (error) {
    console.error('Error adding task to user:', error);
    setErrorMessage('An error occurred while adding task.');
  }

  resetAddTaskState();  // Reset inputs and close overlay
}
  
  
  async function handleDeleteTask(user_id){
    console.log("no implementation now :(")
  //   axios
  //   .post('http://localhost:8700/tasks', {
  //     userid: data?._id,
  //     task_name: Title,
  //     task_due_date: '2024-11-15T22:25:30.000+00:00',
  //     task_description: 'None',
  //     task_tags: []
  //   })
  //   .then((response) => {
  //     console.log('Response:', response.data);
  //     if (response.data.message.includes('Task retrieved successfully')) {
  //       setErrorMessage(null);
  //     } else {
  //       setErrorMessage(response.data.message || 'An error occurred upon adding a task.');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Error adding task to user:', error);
  //     setErrorMessage('An error occurred while adding task.');
  //   });

  //   if (errorMessage === null) {
  //   const newTask = {
  //     title: Title,
  //     taskdate: TaskDate,
  //     points: Points,
  //     priority: Priority,
  //     description: Description,
  //   };

  //   setTasks([...tasks, newTask]);  // Add new task to the tasks list
  // }
  //   resetAddTaskState();  // Reset inputs and close overlay
  };

  const { state } = useLocation();
  const { username, password } = state || {};

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
          setTasks(response.data.tasks || []); // Default to an empty array if no tasks
        })
        .catch(() => setErrorMessage('An error occurred while fetching tasks.'));
    }
  }, [data?._id]);
  

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <div className="points_container">
        <div className="points_text">Points: {Points_Day}</div>
      </div>
      <h1 className='large-heading'>To-Do</h1>

      {/* Display user data */}
      {data ? (
        <div className="data-container">
          <p>Welcome {data.name}!</p>
        </div>
      ) : (
        <p>No data available.</p>
      )}

      {/* Sort and filter section */}
      <div className='sorts-container'>
        <div className='sort_points'>
          Points
          <img src={sort_carrot} alt="sort_carrot" className='sort-icon'/>
        </div>
        <div className="sort-task">
          Task Name
          <img src={sort_carrot} alt="sort_carrot" className="sort-icon" />
        </div>
        <div className="sort_date">
          Date
          <img src={sort_carrot} alt="sort_carrot" className="sort-icon" />
        </div>
        <img
          src={filter_icon}
          onClick={toggleOverlayFilter}
          alt="filter_icon"
          className="filter-icon"
        />
        <Link to="/calendar">
          <img
            src={list_view_icon}
            alt="list_view_icon"
            className="list_view_icon"
          />
        </Link>
      </div>
      <hr className="title-divider" />

      {/* Dynamically Render Tasks */}
      <div>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index}>
              <div className="task-container">
                {/* Temp implementation */}
                <div className="point-value">+{99}</div> 
                <div className="task-name">{task.task_name}</div>
                <div className="date">{new Date(task.task_due_date).toLocaleDateString()}</div>
                <img src={trash_icon} alt="trash_icon" /*onClick={handleDeleteTask(task._id)}*/ className="trash-icon" />
                <img src={options} alt="options" className="options-icon" />
              </div>

              <div className="separator"></div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>


      {/* Add Task Button */}
      <div>
        <button onClick={toggleOverlayAddTask} className="add-task-button">
          <div className="add-task-button-text">Add Task</div>
        </button>

        {/* Add Task Overlay */}
        <Overlay isOpen={isOpenAddTask} onClose={toggleOverlayAddTask}>
          <div className="overlay-item-container">
            <div className="overlay-text-container">Title:</div>
            <input
              type="text"
              className="text-input"
              value={Title}
              onChange={handleTitleChange}
            />
          </div>
          {/* Date */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Date:</div>
            <input
              type="text"
              className="text-input"
              value={TaskDate}
              onChange={handleTaskDateChange}
            />
          </div>
          {/* Points */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Points:</div>
            <input
              type="text"
              className="text-input"
              value={Points}
              onChange={handlePointsChange}
            />
          </div>
          {/* Priority */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Priority:</div>
            <input
              type="text"
              className="text-input"
              value={Priority}
              onChange={handlePriorityChange}
            />
          </div>
          {/* Description */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Description:</div>
            <textarea
              type="text"
              className="text-input-description"
              value={Description}
              onChange={handleDescriptionChange}
            />
          </div>
          <button className="add-task-button" onClick={handleAddTask} style={{ width: "150px", height: '50px' }}>
            <div className="add-task-button-text" style={{ fontSize: '24px' }}>
              Add Task
            </div>
          </button>
        </Overlay>
      </div>

      {/* Filter Overlay */}
      <Overlay isOpen={isOpenFilter} onClose={toggleOverlayFilter}>
        <div className="overlay-item-container">
          <div className="overlay-text-container">Date</div>
          <div className="dropdown">
            <span>{taskDateComparitor}</span>
            <div className="dropdown-content">
              <p onClick={() => setTaskDateComparitor('Before')}>Before</p>
              <p onClick={() => setTaskDateComparitor('After')}>After</p>
            </div>
          </div>
          <input
            type="text"
            className="text-input"
            // value={dateComparitor} // Handle value change if needed
            // onChange={handleFilterChange}
          />
        </div>
      </Overlay>

      {/* Logout Button */}
      <Link to="/login">
        <button>Log Out</button>
      </Link>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default ToDoMain;
