import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

  return (
    <div>
        <h1>Home</h1>
        <button
            onClick={()=>{localStorage.clear() 
            dispatch({type:"CLEAR"})
            history('/login')
            }}
        >Logout</button>
    </div>
  )
}

export default Home