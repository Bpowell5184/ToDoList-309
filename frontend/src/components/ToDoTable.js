import React, { useState } from 'react';
import ToDoRow from './ToDoRow';

const ToDoTable = ({ tasks, setTasks }) => {

    /* Delete a task from table */
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
      };

    return (
    <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <tbody>
        {tasks.map(task => (
            <ToDoRow
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            />
        ))}
        </tbody>
    </table>
    );
};

export default ToDoTable;