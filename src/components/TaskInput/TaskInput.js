import React, { useState } from 'react'
import './TaskInput.css';
import { AiOutlinePlus, AiFillPlusCircle } from 'react-icons/ai';
import { async } from '@firebase/util';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const TaskInput = ({ tasklist_id }) => {
    const [isHover, setHover] = useState(false);
    const [taskName, setTaskName] = useState('');

    const SetInputText = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
            AddNewTask();
        }
    }

    const AddNewTask = async () => {
        console.log('add new task');
        console.log('tasklist_id: ', tasklist_id);
        const docRef = collection(db, 'Task');
        const data = {
            task_name: taskName,
            tasklist_id: tasklist_id
        }
        const docRes = await addDoc(docRef, data);
        setTaskName('');
        console.log('docRes: ', docRes);
    }

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
              <input type="text" className='task__input' placeholder='Title' onKeyUp={(event) => SetInputText(event)}
                onChange={(e) => setTaskName(e.target.value)} value={taskName} />
          </div>
      </div>
  )
}

export default TaskInput