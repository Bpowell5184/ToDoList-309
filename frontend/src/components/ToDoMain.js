import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '.././assets/logo.png';
import sort_carrot from '.././assets/sort_carrot.png'
import filter_icon from '.././assets/filter_icon.png'
import list_view_icon from '.././assets/list_view_icon.png'
import trash_icon from '.././assets/trash_icon.png'
import options from '.././assets/options.png'
import Overlay from './';
import './ToDoMain.css'

function ToDoMain() {

  const [points, setPoints] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <div className='points_container'>
        <div className='points_text'>
          Points: {points}
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
        <img src={filter_icon} alt="filter_icon" className='filter-icon'/>
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
      <button onClick={toggleOverlay} className='add-task-button'>
        <div className='add-task-button-text'>
          Add Task
        </div>
      <Overlay isOpen={isOpen} onClose={toggleOverlay}>
        <h1>Content in Overlay</h1>
      </Overlay>
      </button>
      </div>
      
      <Link to="/login">
        <button>Log Out</button>
      </Link>
    </div>
  );
}

export default ToDoMain
