import React from "react";
import trash_icon from '.././assets/trash_icon.png';
import options from '.././assets/options.png';

const ToDoRow = ({task, onDelete}) => {
    return (
        <tr>
            <td>{task.points}</td>
            <td>{task.title}</td>
            <td>{task.dueDate}</td>
            <td>
                {/* Delete item */}
                <button onClick={() => onDelete(task.id)}>
                    <img src={trash_icon} alt="trash_icon" className='trash-icon' />
                </button>
                {/* More options */}
                <button>
                    <img src={options} alt="options" className='options-icon' />
                </button>
            </td>
        </tr>
    )
};

export default ToDoRow;