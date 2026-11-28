import './App.css';
import { createContext, useEffect, useReducer, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { initialState, reducer } from './reducers/userReducer';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Loader from './components/Loader/Loader';

export const UserContext = createContext();

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    // Wait for Firebase to restore the signed-in user before reading data,
    // otherwise the database rules see an anonymous request and refuse it.
    const [authReady, setAuthReady] = useState(false);
    const [firebaseUser, setFirebaseUser] = useState(null);

    useEffect(() => onAuthStateChanged(auth, (u) => {
        setFirebaseUser(u);
        setAuthReady(true);
        if (!u) {
            localStorage.removeItem('user');
            dispatch({ type: 'CLEAR' });
        }
    }), []);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('user'));
        if (saved && state === null) {
            dispatch({ type: 'USER', payload: saved });
        }
    }, [state]);

    if (!authReady) return <Loader />;

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {firebaseUser && user && user.uid === firebaseUser.uid ? <Home /> : <Login />}
        </UserContext.Provider>
    );
}

export default App;
