import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';
import './Home.css';
import TaskList from '../TaskList/TaskList';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

  return (
    <div className='home__container'>
      {/* TODO: Board name */}
      <h3>Main Board</h3>

      {/* List of Task list */}
      <div className="home__tasklist">
        <TaskList />
        <TaskList />
      </div>
    </div>
  )
}

export default Home