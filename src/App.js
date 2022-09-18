import './App.css';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { BrowserRouter, useNavigate  , Routes, Route } from 'react-router-dom';
import { initialState, reducer } from './reducers/userReducer';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';

export const UserContext = createContext();

const Rounting = () => {
  const {state, dispatch} = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));;

  

  return(
    <Routes>
    <Route path="/" element={user ? <Home /> : <Login></Login>} ></Route>
    {/* <Route path="/" element={<Home />} ></Route> */}
    {/* <Route path="/login" element={<Login />} ></Route> */}
  </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));;
    if (user && state === null) {
      dispatch({type:"USER",payload: user})
    }
  },[state]);

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
      <Rounting />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
