import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import { UserContext } from '../../App';
import { auth, provider } from '../../firebase/firebase';
import GoogleButton from 'react-google-button'
import './Login.css';

const Login = () => {
    const history = useNavigate ();
    const {state,dispatch} = useContext(UserContext)

    const Login = async () => {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = {
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL
        }
        console.log(token);
        console.log(user);
                localStorage.setItem("user",JSON.stringify(user));
                dispatch({type:"USER",payload: user})
                history('/')
    }
  return (
    <div className='login__container'>
        {/* TODO: login header */}
        <div className='login__header'>
            <h2>TaskBoard</h2>
        </div>
        {/* TODO: login with google button */}
        <div className='login__button'>
            <GoogleButton onClick={Login} />
        </div>
    </div>
    
  )
}

export default Login