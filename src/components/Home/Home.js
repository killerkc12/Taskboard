import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

  return (
    <div>
        <h1>Home</h1>
        <p>Tomorrow start with preparation of Task database structure and UI</p>
    </div>
  )
}

export default Home