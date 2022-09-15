import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate  } from 'react-router-dom';

const Home = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

  return (
    <div>
        <h1>Home</h1>
        <p>name : { JSON.stringify(state) }</p>
        <p>uid : { state?.uid }</p>
        <p>name : { state?.name }</p>
        <p>email : { state?.email }</p>
        <p>photo : </p>
        <img src={state?.photo} alt="" />
        <button
            onClick={()=>{localStorage.clear() 
            dispatch({type:"CLEAR"})
            history('/')
            }}
        >Logout</button>
    </div>
  )
}

export default Home