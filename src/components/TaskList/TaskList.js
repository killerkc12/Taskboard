import React from 'react'
import Task from '../Task/Task';
import TaskInput from '../TaskInput/TaskInput';
import './TaskList.css';

const TaskList = () => {
  return (
    <div className='tasklist__container'>
        {/* TODO: tasklist header */}
        <div className="tasklist__header">
            <div className='tasklist__header__name'>My Tasks</div>
        </div>

        {/* add task here */}
        <div className="tasklist__tasks">
            <TaskInput />
            <Task />
            <Task />
            <Task />
        </div>
    </div>
  )
}

export default TaskList