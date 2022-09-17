import React, { useState } from 'react'
import './TaskInput.css';
import { AiOutlinePlus, AiFillPlusCircle } from 'react-icons/ai';

const TaskInput = () => {
    const [isHover, setHover] = useState(false);
    return (
      <div className="task__input_container" onMouseOut={() => setHover(false)} onMouseMove={() => setHover(true)}>
          <div className="task__button__container">
                {   
                    !isHover && <AiOutlinePlus  className='task__button' />
                }
                {
                    isHover && <AiFillPlusCircle  className='task__button__circle' />
                }
          </div>
          <div className="task__inputbox__container">
              <input type="text" className='task__input' placeholder='Title' />
          </div>
      </div>
  )
}

export default TaskInput