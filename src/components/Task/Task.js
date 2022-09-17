import React, { useState } from 'react'
import './Task.css';
import { BsCircle } from 'react-icons/bs';
import { MdDone } from 'react-icons/md';

const Task = (props) => {
    const [isHover, setHover] = useState(false);
  return (
    <div className='task__container'>
        {/* icon */}
        <div className="task__icon">
            { 
                !isHover && <BsCircle onMouseMove={() => setHover(true)}  className='task__icon__circle' />
            }
            { 
                isHover && <MdDone onMouseOut={() => setHover(false)}  className='task__icon__done' />
            }
        </div>
        {/* name */}
        <div className="task__name">
            { props.task.task_name }
        </div>
    </div>
  )
}

export default Task