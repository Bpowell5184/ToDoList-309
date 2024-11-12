import React, { useState, userRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import sort_carrot from '.././assets/sort_carrot.png'
import filter_icon from '.././assets/filter_icon.png'
import list_view_icon from '.././assets/list_view_icon.png'
import trash_icon from '.././assets/trash_icon.png'
import options from '.././assets/options.png'
import Overlay from './';
// import Overlay from 'react-overlays/Overlay';
import './ToDoMain.css'

function ToDoMain() {

  const [Points_Day] = useState('0')
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);
  const toggleOverlayAddTask = () => {
    setIsOpenAddTask(!isOpenAddTask);
  };
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const toggleOverlayFilter = () => {
    setIsOpenFilter(!isOpenFilter);
  };
  const [dateComparitor, setDateComparitor] = useState('Time?')
  const editDateComparitor = (change) => {
    setDateComparitor(change)
  }

  const [Title, setTitle] = useState('');
  const [Date, setDate] = useState('');
  const [Points, setPoints] = useState('');
  const [Priority, setPriority] = useState('');
  const [Description, setDescription] = useState('');
  const handleTitleChange = (event) => {
      const newTitle = event.target.value;
      setTitle(newTitle);
    };
  const handleDateChange = (event) => {
      const newDate = event.target.value;
      setDate(newDate);
    };
  const handlePointsChange = (event) => {
      const newPoints = event.target.value;;
      setPoints(newPoints);
    };
  const handlePriorityChange = (event) => {
      const newPriority = event.target.value;
      setPriority(newPriority);
    };
  const handleDescriptionChange = (event) => {
      const newDescription = event.target.value;
      setDescription(newDescription);
    };
  const resetAddTaskState = () => {

    setDate('');
    setDescription('');
    setPoints('');
    setPriority('');
    setTitle('');
    toggleOverlayAddTask();
  };
  
  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <div className='points_container'>
        <div className='points_text'>
          Points: {Points_Day}
        </div>
      </div>
      <h1 className='large-heading'>To-Do</h1>

      <div className='sorts-container'> 
        <div className='sort_points'> 
          Points 
          <img src={sort_carrot} alt="sort_carrot" className='sort-icon'/>
        </div>
        <div className='sort-task'>
          Task Name
          <img src={sort_carrot} alt="sort_carrot" className='sort-icon'/>
        </div>
        <div className='sort_date'> 
          Date 
          <img src={sort_carrot} alt="sort_carrot" className='sort-icon'/>
        </div>
        <img src={filter_icon} onClick={toggleOverlayFilter} alt="filter_icon" className='filter-icon'/>
        <Link to ="/calendar">
          <img src={list_view_icon} alt="list_view_icon" className='list_view_icon'/>
        </Link>
      </div>
      <hr class="title-divider" /> 

      <div className='task-container'>
        <div className='point-value'>
          +5
        </div>
        <div className='task-name'>
          Homework from CS
        </div>
        <div className='date'> 
          12/12/12
        </div>
        <img src={trash_icon} alt="trash_icon" className='trash-icon'/>
        <img src={options} alt="options" className='options-icon'/>
      </div>

      <div>
        <button onClick={toggleOverlayAddTask} className='add-task-button'>
          <div className='add-task-button-text'>
            Add Task
          </div>
        </button>

        <Overlay isOpen={isOpenAddTask} onClose={toggleOverlayAddTask}>
          <div className='overlay-item-container'>
            <div className='overlay-text-container'>
              Title:
            </div>
            <input
              type="text"
              className="text-input"
              value={Title}
              onChange={handleTitleChange}
            />
          </div>
          {/* Date */}
          <div className='overlay-item-container'>
            <div className='overlay-text-container'>
              Date:
            </div>
          <input
            type="text"
            className="text-input"
            value={Date}
            onChange={handleDateChange}
          />
          </div>
          {/* Points */}
          <div className='overlay-item-container'>
            <div className='overlay-text-container'>
              Points:
            </div>
          <input
            type="text"
            className="text-input"
            value={Points}
            onChange={handlePointsChange}
          />
          </div>
          {/* Priority */}
          <div className='overlay-item-container'>
            <div className='overlay-text-container'>
              Priority:
            </div>
          <input
            type="text"
            className="text-input"
            value={Priority}
            onChange={handlePriorityChange}
          />
          </div>
          {/* Description */}
          <div className='overlay-item-container'>
            <div className='overlay-text-container'>
              Description:
            </div>
          <textarea
            type="text"
            className="text-input-description"
            value={Description}
            onChange={handleDescriptionChange}
          />
          </div>
          {/* Overlay Add Task Button */}
          <button className='add-task-button' onClick={resetAddTaskState} style={{ width: "150px", height: '50px'}}>
            <div className='add-task-button-text' style={{ fontSize: '24px'}}>
              Add Task
            </div>
          </button>

        </Overlay>
      </div>

      <Overlay isOpen={isOpenFilter} onClose={toggleOverlayFilter}>

        <div className='overlay-item-container'>
          <div className='overlay-text-container'>
            Date
          </div>
          <div class="dropdown">
          <span>{dateComparitor}</span>
        <div class="dropdown-content">
          <p onClick={() => editDateComparitor("Before")}>Before</p>
          <p onClick={() => editDateComparitor("After")}>After</p>
        </div>
        </div>
        <input
          type="text"
          className="text-input"
          // value={}
          // onChange={}
        />

        </div>
          <div class="dropdown">
            <span>Tags</span>
          <div class="dropdown-content">
            <p>Hello World!</p>
          </div>
          </div>
      </Overlay>

      <Link to="/login">
        <button>Log Out</button>
      </Link>
    </div>
  );
}

export default ToDoMain