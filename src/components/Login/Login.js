import { signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { auth, db, provider } from '../../firebase/firebase';
import GoogleButton from 'react-google-button';
import './Login.css';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
    const {dispatch} = useContext(UserContext);

    const Login = async () => {
        const result = await signInWithPopup(auth, provider);
        
        let currentUser = await GetUser(result.user.uid);
        if(currentUser === undefined){
            const uid = await AddUser(result.user);
            const board_id = await AddBoard(uid);
            const tasklist_id = await AddTaskList(board_id);
            await SetDefaultValues(uid,board_id,tasklist_id);
            currentUser = await GetUser(result.user.uid);
        }
        const user = {
            uid: result.user.uid,
            name: currentUser.name,
            email: currentUser.email,
            photo: currentUser.photo,
            default_board: currentUser.default_board,
            default_tasklist: currentUser.default_tasklist
        };
        localStorage.setItem('user',JSON.stringify(user));
        dispatch({type:'USER',payload: user});
    };

    const SetDefaultValues = async (uid,board_id,tasklist_id) => {
        const docRef = doc(db, 'User', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await setDoc(doc(db, 'User', uid), {
                default_board: board_id,
                default_tasklist: tasklist_id
            }, { merge: true });
        }
    };
    
    const AddUser = async (user) => {
        const docRef = doc(db, 'User', user.uid);
        const data = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL
        };
        await setDoc(docRef, data);
        return user.uid;
    };

    const AddBoard = async (uid) => {
        const docRef = collection(db, 'Board');
        const data = {
            board_name: 'Main board',
            uid: uid
        };
        const docRes = await addDoc(docRef, data);
        return docRes.id;
    };

    const AddTaskList = async (board_id) => {
        const docRef = collection(db, 'TaskList');
        const data = {
            board_id: board_id,
            tasklist_name: 'Main tasklist'
        };
        const docRes = await addDoc(docRef, data);
        return docRes.id;
    };

    const GetUser = async (uid) => {
        const docRef = doc(db, 'User', uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    };
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
    
    );
};

export default Login;