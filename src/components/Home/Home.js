import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';
import './Home.css';
import TaskList from '../TaskList/TaskList';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Navbar from '../Navbar/Navbar';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext);
    const [taskList, setTaskList] = useState([]);
    const [isTaskList, setIsTaskList] = useState(false);

    const GetTaskList = async () => {
      console.log(state.default_board);
      const q = query(collection(db, 'TaskList'), where('board_id', '==', state.default_board));
      onSnapshot(q, (querySnapshot) => {
        const list = [];
        querySnapshot.docs.map((doc) => (
          list.push({ id: doc.id, ...doc.data() }
          )));
        setTaskList(list);
      })
      setIsTaskList(true);
    }

    useEffect(() => {
      console.log('state: ', state);
      console.log('taskList: ', taskList);
      if (state !== null && !isTaskList) GetTaskList();
    }, [state])

  return (
    <div className='main__container'>
      { state?.uid && <Navbar /> }
      <div className='home__container'>
        {/* TODO: Board name */}
        <h3>Main Board</h3>

        {/* List of Task list */}
        <div className="home__tasklist">
          {
            taskList?.map((item, index) => {
              return <div key={index}>
                <TaskList  taskList={item} />
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Home