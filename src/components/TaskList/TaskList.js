/* eslint-disable react/prop-types */
import { collection, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import Loader from '../Loader/Loader';
import Task from '../Task/Task';
import TaskInput from '../TaskInput/TaskInput';
import './TaskList.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { MdDelete } from 'react-icons/md';
import { deleteDoc, doc } from 'firebase/firestore';
import { MdBrush } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const TaskList = (props) => {
    const [task, setTask] = useState([]);
    const [completedTask, setCompletedTask] = useState([]);
    const [isTask, setIsTask] = useState(false);
    const [isTaskLoading, setTaskLoading] = useState(true);
    const [isCompletedTaskCollapsed, setCompletedTaskCollapsed] = useState(false);

    const GetAllTask = async () => {
        const q = query(collection(db, 'Task'), where('tasklist_id', '==', props.taskList.id));
        onSnapshot(q, (querySnapshot) => {
            const list = [];
            const completedList = [];
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().isCompleted === true) 
                    completedList.push({ id: doc.id, ...doc.data() });
                else list.push({ id: doc.id, ...doc.data() })
            });
            list.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1);
            setTask(list);
            setCompletedTask(completedList);
            setTaskLoading(false);
        });
        setIsTask(true);
    };

    useEffect(() => {
        if (!isTask) GetAllTask();
    });

    return (
        <div className='tasklist__container' style={{backgroundColor: props.taskList.color}}>
            {/* TODO: tasklist header */}
            <div className="tasklist__header">
                <div className='tasklist__header__name'>
                    <span>{props.taskList.tasklist_name}</span>
                    <Popup
                        trigger={
                            <div className="task__options">
                                <BsThreeDotsVertical />
                            </div>
                        }
                        position="right top"
                        on="click"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: '0px', border: 'none' }}
                        arrowStyle={{ color: '#3A3C45' }}
                        arrow={true}
                    >
                        <MenuOptions taskList = {props.taskList} />
                    </Popup>
                </div>
            </div>

            {/* add task here */}
            <div className="tasklist__tasks">
                { isTaskLoading ? <Loader /> : <>
                    <TaskInput tasklist_id={props.taskList.id} />
                    {
                        task?.map((item, index) => {
                            return <div key={index}>
                                <Task task={item} />
                            </div>;
                        })
                    }
                    <div className='tasklist_completed_container'
                         onClick={() => setCompletedTaskCollapsed(!isCompletedTaskCollapsed)}
                    >
                        <p className='tasklist_completed'>
                            Completed ({completedTask.length})
                        </p>
                        {
                            isCompletedTaskCollapsed ? <IoIosArrowUp className='up_arrow' /> : <IoIosArrowDown className='down_arrow' />
                        }
                    </div>
                    {
                        isCompletedTaskCollapsed &&
                        completedTask?.map((item, index) => {
                            return <div key={index}>
                                <Task task={item} isCompleted={true} />
                            </div>;
                        })
                    }
                </>}
            </div>

        </div>
    );
};

const MenuOptions = (props) => {

    const DeleteTask = async (id) => {
        await deleteDoc(doc(db, 'TaskList', id));
    };

    const SetListColor = async (color) => {
        const docRef = doc(db, 'TaskList', props.taskList.id);
        await updateDoc(docRef, {
            color: color
        });
    };

    return (
        <div className="menu">
            <div className="menu-item"
                onClick={() => DeleteTask(props.taskList.id)}
            > 
                <MdDelete className='menu-icon' />
                Delete list
            </div>
            <div className="menu-item"
                // onClick={() => DeleteTask(id)}
            > 
                <MdBrush className='menu-icon' />
                Set Color - &nbsp;
                <input type='color' value={props.taskList.color} onChange={(e) => SetListColor(e.target.value)} />
            </div>
        </div>
    );
};

export default TaskList;
