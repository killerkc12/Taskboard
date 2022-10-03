/* eslint-disable react/prop-types */
import { collection, onSnapshot, query, where } from 'firebase/firestore';
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

const TaskList = (props) => {
    const [task, setTask] = useState([]);
    const [isTask, setIsTask] = useState(false);
    const [isTaskLoading, setTaskLoading] = useState(true);

    const GetAllTask = async () => {
        const q = query(collection(db, 'Task'), where('tasklist_id', '==', props.taskList.id));
        onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.docs.map((doc) => (
                list.push({ id: doc.id, ...doc.data() })
            ));
            list.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1);
            setTask(list);
            setTaskLoading(false);
        });
        setIsTask(true);
    };

    useEffect(() => {
        if (!isTask) GetAllTask();
    }, []);

    return (
        <div className='tasklist__container'>
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
                        <MenuOptions id = {props.taskList.id} />
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
                </>}
            </div>

        </div>
    );
};

const MenuOptions = ({id}) => {
    const DeleteTask = async (id) => {
        await deleteDoc(doc(db, 'TaskList', id));
    };
    return (
        <div className="menu">
            <div className="menu-item"
                onClick={() => DeleteTask(id)}
            > 
                <MdDelete className='menu-icon' />
                Delete 
            </div>
        </div>
    );
};

export default TaskList;
