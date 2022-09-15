import React, { useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import { UserContext } from '../../App';

const Login = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

    const Login = () => {
                localStorage.setItem("user",JSON.stringify('Kiran'))
                dispatch({type:"USER",payload:'Kiran'})
                history('/')
    }
  return (
    <div>
        <h1>Login</h1>
        <button onClick={Login}>Login</button>
    </div>
    
  )
}

export default Login