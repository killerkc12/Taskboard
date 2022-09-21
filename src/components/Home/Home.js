import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';
import './Home.css';
import TaskList from '../TaskList/TaskList';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Navbar from '../Navbar/Navbar';
import TaskListInput from '../TaskListInput/TaskListInput';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext);
    const [taskList, setTaskList] = useState([]);
    const [isTaskList, setIsTaskList] = useState(false);

    const GetTaskList = async () => {
      const q = query(collection(db, 'TaskList'), where('board_id', '==', state.default_board));
      onSnapshot(q, (querySnapshot) => {
        const list = [];
        querySnapshot.docs.map((doc) => (
          list.push({ id: doc.id, ...doc.data() }
          )));
          list.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1);
        setTaskList(list);
      })
      setIsTaskList(true);
    }

    useEffect(() => {
      if (state !== null && !isTaskList) GetTaskList();
    }, [state])

  return (
    <div className='main__container'>
      { state?.uid && <Navbar /> }
      <div className='home__container'>
        {/* TODO: Board name */}
        <h3>Main Board</h3>
        { new Date().toString()}

        {/* List of Task list */}
        <div className="home__tasklist">
          {
            taskList?.map((item, index) => {
              return <div key={index}>
                <TaskList  taskList={item} />
              </div>
            })
          }
          <TaskListInput board_id={state?.default_board} />
        </div>
      </div>
    </div>
  )
}

export default Home