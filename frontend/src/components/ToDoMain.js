import React, { useState, useEffect } from 'react';
import { useLocation, Link /*useNavigate*/ } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '.././assets/logo.png';
import sort_carrot from '.././assets/sort_carrot.png';
import filter_icon from '.././assets/filter_icon.png';
import list_view_icon from '.././assets/list_view_icon.png';
import trash_icon from '.././assets/trash_icon.png';
import options from '.././assets/options.png';
import Overlay from './';
import axios from 'axios';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'
import './ToDoMain.css';
import './Overlay.css';

function ToDoMain() {
  const [Points_Total, setPointsTotal] = useState('1');

  const [currentDescription, setIsCurrentDescription] = useState('');

  const [isOpenDealWithTask, setIsOpenDealWithTask] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [isCheckedViewCompletedTasks, setIsCheckedViewCompletedTasks] =
    useState(false);

  const [sortDescDate, setSortDescDate] = useState(false);
  const [sortDescPoints, setSortDescPoints] = useState(false);
  const [sortDescTask, setSortDescTask] = useState(false);

  const [tasks, setTasks] = useState([]);

  //const navigate = useNavigate();

  const [TaskId, setTaskId] = useState('');
  const [Title, setTitle] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [Points, setPoints] = useState(1);
  const [Tags, setTags] = useState([]);
  const [Description, setDescription] = useState('');
  const [dealWithTaskText, setDealWithTaskText] = useState('');
  const [data, setData] = useState(null);
  const [addTaskOverlayErrorMessage, setAddTaskOverlayErrorMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [tagsList, setTagsList] = useState([]);
  const [uniqueTagsList, setuniqueTagsList] = useState([]);
  const [sortTagList, setSortTagList] = useState([]);

  // Meant to manage which task is being 'hovered'
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  // Manage Dark/Light Mode
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Handle changes in input fields
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleTaskDateChange = (event) => setTaskDate(event.target.value);
  const handlePointsChange = (event) => setPoints(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  // handles filtering by tag
  const changeTagConstraint = (toggledTag, activityState) => {
    setSortTagList((prevSortTagList) => {
      const updatedTagList = activityState
        ? [...prevSortTagList, toggledTag] // Add tag
        : prevSortTagList.filter((tag) => tag !== toggledTag); // Remove tag

      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          isVisible:
            updatedTagList.length === 0 ||
            task.task_tags.some((tag) => updatedTagList.includes(tag)), // Check if any tag matches
        })),
      );

      return updatedTagList;
    });
  };

  const addTag = () => {
    if (Tags.length > 15) {
      setAddTaskOverlayErrorMessage('Tags cannot have length greater than 15');
      return;
    }
    if (Tags.length > 1 && !tagsList.includes(Tags)) {
      setTagsList([...tagsList, Tags]); // Add tag to list if it's not empty and unique
      setTags('#'); // Reset input
    }
  };

  const handleTagsChange = (event) => {
    let value = event.target.value;

    value = value.toLowerCase();

    if (!value.startsWith('#')) {
      value = '#' + value.replace(/^#*/, '');
    }

    setTags(value);
  };

  // Handle dynamic rendering
  const handlePointsMouseOn = (taskId) => {
    setHoveredTaskId(taskId);
  };

  const handlePointsMouseOut = () => {
    setHoveredTaskId(null);
  };

  // Handle Theme Change
  const handleThemeChange = () => {
    setIsDark((prev) => {
      const newTheme = !prev
      document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    })
  };

  // Keep user preference of dark/light mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Define method to remove task from frontend and call backend
  const handleCompleteTask = async (taskId) => {
    setHoveredTaskId(null);
    try {
      const response = await axios.put(
        `http://todo.dylanwatanabe.com:8700/tasks/${taskId}`,
        {
          task_completed: true,
        },
      );
      if (response.status === 200) {
        // Update frontend state to remove the task

        setTasks((prevTasks) =>
          prevTasks.map(
            (task) =>
              task._id === taskId
                ? { ...task, task_completed: true } // Update the specific task
                : task, // Leave other tasks unchanged
          ),
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
    setPoints(1);
    setTags('');
    setTagsList([]);
    setTitle('');
    setAddTaskOverlayErrorMessage(null)
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
      setTagsList(task.task_tags);
      setTitle(task.task_name);
      setTaskId(task._id);
    }

    if (option === 'Close') {
      resetAddTaskState();
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
    if (Title.length === 0) {
      setAddTaskOverlayErrorMessage('Enter a task name');
      return;
    }
    if (Title.length >= 50) {
      setAddTaskOverlayErrorMessage('Title name too long');
      return;
    }
    if (!TaskDate) {
      setAddTaskOverlayErrorMessage('Please input a date');
      return;
     }
    if (Points >= 50 || Points <= 0) {
      setAddTaskOverlayErrorMessage('Points can not be negative or zero; Points for one task cannot be greater than 50');
      return;
    }
    if (!Points) {
     setPoints(1);
    }
    if (!Description) {
      setAddTaskOverlayErrorMessage('Please add a description')
      return;
    }
    if (dealWithTaskText === 'Add Task') {
      try {
        const response = await axios.post(
          'http://todo.dylanwatanabe.com:8700/tasks',
          {
            userid: data?._id,
            task_name: Title,
            task_due_date: TaskDate,
            points: Points,
            task_description: Description,
            task_tags: tagsList,
          },
        );

        console.log('Response:', response.data);

        if (response.data.message.includes('Task added successfully.')) {
          setErrorMessage(null);
          const newTask = {
            _id: response.data.task._id,
            title: Title,
            task_due_date: TaskDate,
            points: Points,
            task_tags: tagsList,
            task_description: Description,
            task_name: Title,
            isVisible: true,
          };

          setTasks((prevTasks) => [...prevTasks, newTask]);
        } else {
          setErrorMessage(
            response.data.message || 'An error occurred upon adding a task.',
          );
        }
      } catch (error) {
        console.error('Error adding task to user:', error);
        setAddTaskOverlayErrorMessage('An error occurred while adding task.');
        return;
      }

      resetAddTaskState();
    } else if (dealWithTaskText === 'Edit Task') {
      try {
        const response = await axios.put(
          `http://todo.dylanwatanabe.com:8700/tasks/${TaskId}`,
          {
            task_name: Title,
            task_due_date: TaskDate,
            points: Points,
            task_description: Description,
            task_tags: tagsList,
          },
        );

        console.log('Response:', response.data);

        if (response.data.message.includes('Task updated successfully')) {
          setErrorMessage(null);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === TaskId
                ? { ...task, ...response.data.task } // Merge old task properties with updated task
                : task
            )
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
        `http://todo.dylanwatanabe.com:8700/tasks/${task_id}`,
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
    // Collect all unique tags from tasks
    const allTags = tasks.flatMap((task) => task.task_tags);
    const uniqueTags = [...new Set(allTags)];
    setuniqueTagsList(uniqueTags);
  }, [tasks]);

  useEffect(() => {
    // Calculate the total points from completed tasks
    const totalPoints = tasks
      .filter(task => task.task_completed) // Filter only completed tasks
      .reduce((sum, task) => sum + task.points, 0); // Sum up their points
    setPointsTotal(totalPoints);
  }, [tasks]);

  useEffect(() => {
    if (username && password) {
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
        .get(`http://todo.dylanwatanabe.com:8700/tasks/${data._id}`)
        .then((response) => {
          console.log(response.data);
          // Sort tasks by date before setting them so user can see immediately due tasks
          const sortedTasks = (response.data.tasks || []).sort((a, b) => {
            return new Date(a.task_due_date) - new Date(b.task_due_date);
          });

          // Visibility is used for tag filtering
          const tasksWithVisibility = sortedTasks.map((task) => ({
            ...task,
            isVisible: true,
          }));

          setTasks(tasksWithVisibility);
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
        <div className="points_text">Points: {Points_Total}</div>
      </div>
      <h1 className="large-heading">To-Do</h1>

      {/* Display user data */}
      {data ? (
        <div className="data-container">
          <div className="userName">
            <p>Welcome {data.name}!</p>
          </div>
          <div className="dlToggle">
              <Toggle
                checked={isDark}
                onChange={handleThemeChange}
                icons={{ 
                  checked: <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "4px" }}>🌙</span>,
                  unchecked: <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "4px" }}>☀️</span>,
              }}
                aria-label="Dark mode toggle"
              />
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
            className="list-view-icon"
          />
        </Link>
      </div>
      <hr className="title-divider" />

      {/* Dynamically Render Tasks */}
      <div>
        <AnimatePresence>
          {tasks.length > 0 ? (
            tasks
              .filter(
                (task) =>
                  (isCheckedViewCompletedTasks || !task.task_completed) &&
                  task.isVisible,
              )
              .map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -50 }} // Fade in from left
                  animate={{ opacity: 1, x: 0 }} // Animate into position
                  exit={{ opacity: 0, x: 50 }} // Exit animation: fade out to right
                  transition={{ duration: 0.4 }}
                >
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
                    <div className="task-name-container">
                      <div
                        className="task-name"
                        onClick={() =>
                          toggleOverlayDescription(task.task_description)
                        }
                      >
                        {task.task_name}
                      </div>
                      <div className="task-tags">
                        {task.task_tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                            {index < task.task_tags.length - 1 && ' '}
                          </span>
                        ))}
                      </div>
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
                      onClick={() =>
                        toggleOverlayDealWithTask('Edit Task', task)
                      }
                      className="options-icon"
                    />
                  </div>

                  <motion.div
                    className="separator"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ originX: 0.5 }} // Ensures it scales from the center
                  />
                </motion.div>
              ))
          ) : (
            <p>No tasks available.</p>
          )}
        </AnimatePresence>
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
          onClose={() => toggleOverlayDealWithTask('Close')}
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

          {/* Tags */}
          <div className="overlay-item-container">
            <div className="overlay-text-container">Tags:</div>
            <input
              type="text"
              className="text-input"
              value={Tags}
              onChange={handleTagsChange}
            />
            <button
              className="add-task-button"
              onClick={addTag}
              style={{ width: '5vw', height: '5vh' }}
            >
              <div
                className="add-task-button-text"
                style={{ fontSize: '.75vw' }}
              >
                Add Tag
              </div>
            </button>
          </div>
          <div>
            <span style={{ fontSize: '1.2vw', fontWeight: 'bold' }}>
              Current Tag List:
            </span>
            <div>
              {tagsList.map((tag, index) => (
                <span
                  key={index}
                  style={{ marginRight: '8px', fontSize: '1vw' }}
                >
                  {tag}
                </span>
              ))}
            </div>
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
          {addTaskOverlayErrorMessage && <div className="error-message">{addTaskOverlayErrorMessage}</div>}
          <button
            className="add-task-button"
            onClick={handleTaskAction}
            style={{ width: '9vw', height: '9vh' }}
          >
            <div className="add-task-button-text" style={{ fontSize: '1.5vw' }}>
              {dealWithTaskText}
            </div>
          </button>
        </Overlay>
      </div>

      {/* Filter Overlay */}
      <Overlay isOpen={isOpenFilter} onClose={toggleOverlayFilter}>
        <div>
          {uniqueTagsList.length > 0
            ? 'Include Only These Tags:'
            : 'No tags made yet. Add some tags to tasks to access the filter by tag feature.'}
        </div>

        <div>
          {uniqueTagsList.map((tag, index) => (
            <button
              key={index}
              onClick={() =>
                changeTagConstraint(tag, !sortTagList.includes(tag))
              }
              className={`tag-button ${sortTagList.includes(tag) ? 'selected' : 'unselected'}`}
            >
              {tag}
            </button>
          ))}
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
      </Overlay>

      {/* Logout Button */}
      <Link to="/login">
        <button>Log Out</button>
      </Link>
    </div>
  );
}

export default ToDoMain;
