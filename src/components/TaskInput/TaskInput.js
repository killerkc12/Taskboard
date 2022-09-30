import React, { useState } from 'react';
import './TaskInput.css';
import { AiOutlinePlus, AiFillPlusCircle } from 'react-icons/ai';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// eslint-disable-next-line react/prop-types
const TaskInput = ({ tasklist_id }) => {
    const [isHover, setHover] = useState(false);
    const [isInput, setIsInput] = useState(true);
    const [taskName, setTaskName] = useState('');

    const SetInputText = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
            AddNewTask();
        }
    };

    const AddNewTask = async () => {
        const docRef = collection(db, 'Task');
        const data = {
            task_name: taskName,
            tasklist_id: tasklist_id,
            createdOn: new Date()
        };
        setTaskName('');
        await addDoc(docRef, data);
        setIsInput(true);
    };

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
            {
                !isInput ?
                    (
                        <div className="task__inputbox__container">
                            <input type="text" className='task__input' placeholder='Title' onKeyUp={(event) => SetInputText(event)}
                                onChange={(e) => setTaskName(e.target.value)} value={taskName} />
                        </div>
                    ) :
                    (
                        <div className="taskinput__button" onClick={() => setIsInput(!isInput)}>
                            <div className='taskinput__text'>
                            Add a task
                            </div>
                        </div>
                    )
            }
        </div>
    );
};

export default TaskInput;
