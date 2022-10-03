/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './TaskListInput.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const TaskListInput = ({ board_id }) => {
    const [isInput, setIsInput] = useState(true);
    const [taskListName, setTaskLlistName] = useState('');

    const SetInputText = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
            AddNewTaskList();
        }
    };

    const AddNewTaskList = async () => {
        if (taskListName !== '') {
            const docRef = collection(db, 'TaskList');
            const data = {
                tasklist_name: taskListName,
                board_id: board_id,
                createdOn: new Date()
            };
            await addDoc(docRef, data);
            setTaskLlistName('');
            setIsInput(true);
        }
    };

    return (
        <div className='tasklistinput__container'>
            {
                isInput ? 
                    (
                        <div className="tasklistinput__button" onClick={() => setIsInput(!isInput)}>
                            <AiOutlinePlus />
                            <div className='tasklistinput__text'>
                        Add new list
                            </div>
                        </div>
                    ) :
                    (
                        <div className='tasklist__input_container'>
                            <div className="tasklist__inputbox__container">
                                <input type="text" className='tasklist__input' placeholder='Title' onKeyUp={(event) => SetInputText(event)}
                                    onChange={(e) => setTaskLlistName(e.target.value)} value={taskListName} />
                            </div>
                            <AiOutlinePlus className='task__button' onClick={AddNewTaskList} />
                        </div>
                    )
            }
        
        </div>
    );
};

export default TaskListInput;
