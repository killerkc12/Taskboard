import './App.css';
import { createContext, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/userReducer';
import Login from './components/Login/Login';
import Home from './components/Home/Home';

export const UserContext = createContext();

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); if (user && state === null) {
            dispatch({type:'USER',payload: user});
        }
    },[state]);

    return (
        <UserContext.Provider value={{state, dispatch}}>
            {user ? <Home /> : <Login></Login>}
        </UserContext.Provider>
    );
}

export default App;
