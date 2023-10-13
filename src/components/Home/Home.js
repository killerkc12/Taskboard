import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import './Home.css';
import TaskList from '../TaskList/TaskList';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Navbar from '../Navbar/Navbar';
import TaskListInput from '../TaskListInput/TaskListInput';
import Loader from '../Loader/Loader';
import Popup from 'reactjs-popup';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';

const Home = () => {
    const { state } = useContext(UserContext);
    const [taskList, setTaskList] = useState([]);
    const [isTaskList, setIsTaskList] = useState(false);
    const [isTaskListLoading, setTaskListLoading] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false);
    const toggleMode = () => {
        setDarkMode(!isDarkMode);
      };
    const GetTaskList = async () => {
        const q = query(collection(db, 'TaskList'), where('board_id', '==', state.default_board));
        onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.docs.map((doc) => (
                list.push({ id: doc.id, ...doc.data() }
                )));
            list.sort((a, b) => a.createdOn > b.createdOn ? 1 : -1);
            setTaskList(list);
            setTaskListLoading(false);
        });
        setIsTaskList(true);
    };

    useEffect(() => {
        if (state !== null && !isTaskList) GetTaskList();
    }, [state]);

    return (
        <div className='main__container'>
            {state?.uid && <Navbar />}
            <div className='home__container'>
                <div className='board_container'>
                    <h3>Main Board</h3>
                    <Popup
                        trigger={
                            <div className="task__options">
                                <BsThreeDotsVertical />
                            </div>
                        }
                        position="left top"
                        on="click"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: '0px', border: 'none' }}
                        arrowStyle={{ color: '#3A3C45' }}
                        arrow={true}
                    >
                        <MenuOptions id={state?.default_board} />
                    </Popup>
                </div>

                {/* List of Task list */}
                <div className="home__tasklist">
                    {
                        isTaskListLoading ? <Loader /> : <>
                            {
                                taskList?.map((item, index) => {
                                    return <div key={index}>
                                        <TaskList taskList={item} />
                                    </div>;
                                })
                            }
                            <TaskListInput board_id={state?.default_board} />
                        </>
                    }
                </div>
                <button
        className={`mode-button ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleMode}
      >
        {isDarkMode ? '🌙 Dark Mode' : '☀ Light Mode'}
      </button>
            </div>
           
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const MenuOptions = ({ id }) => {
    const DeleteTask = async (id) => {
        await deleteDoc(doc(db, 'Board', id));
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

export default Home;