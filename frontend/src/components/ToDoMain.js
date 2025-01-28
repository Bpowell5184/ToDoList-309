import React, { useState, useEffect } from 'react';
import { useLocation, Link /*useNavigate*/ } from 'react-router-dom';
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

  const [currentDescription, setIsCurrentDescription] = useState('');

  const [isOpenDealWithTask, setIsOpenDealWithTask] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [isCheckedViewCompletedTasks, setIsCheckedViewCompletedTasks] =
    useState(false);

  const [sortDescDate, setSortDescDate] = useState(false);
  const [sortDescPoints, setSortDescPoints] = useState(false);
  const [sortDescTask, setSortDescTask] = useState(false);

  const [taskDateComparitor, setTaskDateComparitor] = useState('Time?');

  const [tasks, setTasks] = useState([]); // State to manage all tasks

  //const navigate = useNavigate();

  const [TaskId, setTaskId] = useState('');
  const [Title, setTitle] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [Points, setPoints] = useState('');
  const [Priority, setPriority] = useState('');
  const [Description, setDescription] = useState('');
  const [dealWithTaskText, setDealWithTaskText] = useState('');
  const [data, setData] = useState(null); // Store user data
  const [errorMessage, setErrorMessage] = useState(null);

  // Meant to manage which task is being 'hovered'
  const [hoveredTaskId, setHoveredTaskId] = useState(null); 

  // Manage Dark/Light Mode
  const [theme, setTheme] = useState("light");

  // Handle changes in input fields
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleTaskDateChange = (event) => setTaskDate(event.target.value);
  const handlePointsChange = (event) => setPoints(event.target.value);
  const handlePriorityChange = (event) => setPriority(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  // Handle dynamic rendering
  const handlePointsMouseOn = (taskId) => {
    setHoveredTaskId(taskId);
  };

  const handlePointsMouseOut = () => {
    setHoveredTaskId(null);
  };

  // Handle Theme Change
  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // set new theme in html
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  // Define method to remove task from frontend and call backend
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:8700/tasks/${taskId}`,
        {
          task_completed: true,
        },
      );
      if (response.status === 200) {
        // Update frontend state to remove the task
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId),
        );
        console.log(`Task with ID ${taskId} marked as complete.`);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error(
        'Error sending task complete request to the backend:',
        error,
      );
    }
  };

  const resetAddTaskState = () => {
    setTaskDate('');
    setDescription('');
    setPoints('');
    setPriority('');
    setTitle('');
    toggleOverlayDealWithTask();
  };

  // Toggle overlay visibility
  const toggleOverlayDealWithTask = (option, task) => {
    setDealWithTaskText(option);
    setIsOpenDealWithTask(!isOpenDealWithTask);
    if (option === 'Edit Task') {
      setTaskDate(task.task_due_date);
      setDescription(task.task_description);
      setPoints(task.points);
      setPriority('');
      setTitle(task.task_name);
      setTaskId(task._id);
    }
  };
  const toggleOverlayFilter = () => setIsOpenFilter(!isOpenFilter);
  const toggleOverlayDescription = (desc) => {
    setIsOpenDescription(!isOpenDescription);
    setIsCurrentDescription(desc);
  };

  const sortByParam = (param) => {
    if (param === 'Date') {
      setSortDescDate(!sortDescDate);
      setTasks((prevTasks) =>
        [...prevTasks].sort(
          (a, b) =>
            sortDescDate
              ? new Date(a.task_due_date) - new Date(b.task_due_date) // Ascending
              : new Date(b.task_due_date) - new Date(a.task_due_date), // Descending
        ),
      );
    } else if (param === 'Task Name') {
      setSortDescTask(!sortDescTask);
      setTasks((prevTasks) =>
        [...prevTasks].sort(
          (a, b) =>
            sortDescTask
              ? a.task_name.localeCompare(b.task_name) // Ascending order
              : b.task_name.localeCompare(a.task_name), // Descending order
        ),
      );
    } else {
      //param is points
      setSortDescPoints(!sortDescPoints);
      setTasks((prevTasks) =>
        [...prevTasks].sort((a, b) =>
          sortDescPoints ? a.points - b.points : b.points - a.points,
        ),
      );
    }
  };

  // Deal with task change, in edit or addition
  async function handleTaskAction() {
    if (dealWithTaskText === 'Add Task') {
      try {
        const response = await axios.post('http://localhost:8700/tasks', {
          userid: data?._id,
          task_name: Title,
          task_due_date: TaskDate,
          points: Points,
          task_description: Description,
          task_tags: [],
        });

        console.log('Response:', response.data);

        if (response.data.message.includes('Task added successfully.')) {
          setErrorMessage(null);
          const newTask = {
            _id: response.data.task._id,
            title: Title,
            task_due_date: TaskDate,
            points: Points,
            priority: Priority,
            task_description: Description,
            task_name: Title,
          };

          setTasks((prevTasks) => [...prevTasks, newTask]);
        } else {
          setErrorMessage(
            response.data.message || 'An error occurred upon adding a task.',
          );
        }
      } catch (error) {
        console.error('Error adding task to user:', error);
        setErrorMessage('An error occurred while adding task.');
      }

      resetAddTaskState();
    } else if (dealWithTaskText === 'Edit Task') {
      try {
        const response = await axios.put(
          `http://localhost:8700/tasks/${TaskId}`,
          {
            task_name: Title,
            task_due_date: TaskDate,
            points: Points,
            task_description: Description,
            task_tags: [],
          },
        );

        console.log('Response:', response.data);

        if (response.data.message.includes('Task updated successfully')) {
          setErrorMessage(null);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === TaskId ? response.data.task : task,
            ),
          );
        } else {
          setErrorMessage(
            response.data.message || 'An error occurred upon updating a task.',
          );
        }
      } catch (error) {
        console.error('Error updating task:', error);
        setErrorMessage('An error occurred while updating task.');
      }

      resetAddTaskState();
    }
  }

  async function handleDeleteTask(task_id) {
    try {
      const response = await axios.delete(
        `http://localhost:8700/tasks/${task_id}`,
      );

      console.log('Response:', response.data);

      if (response.data.message.includes('Task deleted successfully')) {
        setErrorMessage(null);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== task_id),
        );
      } else {
        setErrorMessage(
          response.data.message || 'An error occurred upon deleting a task.',
        );
      }
    } catch (error) {
      console.error('Error deleting task', error);
      setErrorMessage('An error occurred while deleting task.');
    }
  }

  const toggleViewCompletedTasks = () => {
    setIsCheckedViewCompletedTasks((prevState) => !prevState);
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
          console.log(response.data);
          // Sort tasks by date before setting them so user can see immediately due tasks
          const sortedTasks = (response.data.tasks || []).sort((a, b) => {
            return new Date(a.task_due_date) - new Date(b.task_due_date); 
          });
          setTasks(sortedTasks); // Set sorted tasks
        })
        .catch((error) => {
          // Handle errors gracefully
          if (error.response && error.response.status !== 404) {
            setErrorMessage('An error occurred while fetching the user data.');
          }
          // 404 means user has no tasks (yet)
        });
    }
  }, [data?._id]);
  

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <div className="points_container">
        <div className="points_text">Points: {Points_Day}</div>
      </div>
      <h1 className="large-heading">To-Do</h1>

      {/* Display user data */}
      {data ? (
        <div className="data-container">
          <div className="userName">
            <p>Welcome {data.name}!</p>
          </div>
          <div className="dlToggle">
            <button
              onClick = {handleThemeChange}
              className = "theme-button">
              <div>Dark Mode</div>
              </button>
            </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}

      {/* Sort and filter section */}
      <div className="sorts-container">
        <div className="sort_points">
          Points
          <img
            src={sort_carrot}
            onClick={() => sortByParam('Points')}
            alt="sort_carrot"
            className="sort-icon"
          />
        </div>
        <div className="sort-task">
          Task Name
          <img
            src={sort_carrot}
            onClick={() => sortByParam('Task Name')}
            alt="sort_carrot"
            className="sort-icon"
          />
        </div>
        <div className="sort_date">
          Date
          <img
            src={sort_carrot}
            onClick={() => sortByParam('Date')}
            alt="sort_carrot"
            className="sort-icon"
          />
        </div>
        <img
          src={filter_icon}
          onClick={toggleOverlayFilter}
          alt="filter_icon"
          className="filter-icon"
        />
        <Link to="/calendar" state={{ username, password }}>
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
          tasks
            .filter(
              (task) => isCheckedViewCompletedTasks || !task.task_completed,
            )
            .map((task, index) => (
              <div key={index}>
                <div
                  className={`task-container ${task.task_completed ? 'completed-task' : ''}`}
                >
                  <div
                    className="point-value"
                    onMouseOver={() =>
                      !task.task_completed && handlePointsMouseOn(task._id)
                    }
                    onMouseOut={() =>
                      !task.task_completed && handlePointsMouseOut()
                    }
                    onClick={() =>
                      !task.task_completed && handleCompleteTask(task._id)
                    }
                  >
                    {hoveredTaskId === task._id ? '✓' : `+${task.points}`}
                  </div>
                  <div
                    className="task-name"
                    onClick={() =>
                      toggleOverlayDescription(task.task_description)
                    }
                  >
                    {task.task_name}
                  </div>
                  {/*Changes text to red if overdue*/}
                  <div
                    className="date"
                    style={{
                      color:
                        task.task_due_date &&
                        new Date(task.task_due_date) < new Date() &&
                        task.task_completed !== true
                          ? 'red'
                          : 'inherit',
                      fontWeight:
                        task.task_due_date &&
                        new Date(task.task_due_date) < new Date() &&
                        task.task_completed !== true
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {task.task_due_date
                      ? new Date(task.task_due_date).toLocaleString()
                      : '?'}
                  </div>

                  <img
                    src={trash_icon}
                    alt="trash_icon"
                    onClick={() => handleDeleteTask(task._id)}
                    className="trash-icon"
                  />
                  <img
                    src={options}
                    alt="options"
                    onClick={() => toggleOverlayDealWithTask('Edit Task', task)}
                    className="options-icon"
                  />
                </div>

                <div className="separator"></div>
              </div>
            ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>

      {/* Description Overlay */}
      <Overlay isOpen={isOpenDescription} onClose={toggleOverlayDescription}>
        <div className="overlay-item-container">
          <div className="overlay-text-container">{currentDescription}</div>
        </div>
      </Overlay>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Add/Edit Task Button */}
      <div>
        <button
          onClick={() => toggleOverlayDealWithTask('Add Task')}
          className="add-task-button"
        >
          <div className="add-task-button-text">Add Task</div>
        </button>

        {/* Add Task Overlay */}
        <Overlay
          isOpen={isOpenDealWithTask}
          onClose={toggleOverlayDealWithTask}
        >
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
              type="datetime-local"
              className="text-input"
              value={TaskDate}
              onChange={handleTaskDateChange}
            />
          </div>
          {/* Points */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Points:</div>
            <input
              type="number"
              className="text-input"
              min="0"
              max="20"
              value={Points}
              onChange={handlePointsChange}
            />
          </div>

          {/* Priority
          <div className="overlay-item-container">
            <div className="overlay-text-container">Priority:</div>
            <input
              type="text"
              className="text-input"
              value={Priority}
              onChange={handlePriorityChange}
            />
          </div> */}
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
          <button
            className="add-task-button"
            onClick={handleTaskAction}
            style={{ width: '150px', height: '50px' }}
          >
            <div className="add-task-button-text" style={{ fontSize: '24px' }}>
              {dealWithTaskText}
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
        <div>
          <label>
            Enable Viewing of Completed Tasks?
            <input
              type="checkbox"
              checked={isCheckedViewCompletedTasks}
              onChange={toggleViewCompletedTasks}
            />
          </label>
        </div>
        {/* auto sorts by date at beggining... kinda not needed now, and can already sort by date */}
        {/* <label>
          Prioritize Overdue?
          <input
            type="checkbox"
            //checked={isChecked}
            //onChange={handleCheckboxChange}
          />
        </label> */}
      </Overlay>

      {/* Logout Button */}
      <Link to="/login">
        <button>Log Out</button>
      </Link>
    </div>
  );
}

export default ToDoMain;
