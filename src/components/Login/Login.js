import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { auth, db } from '../../firebase/firebase';
import { goToLogin, redirectToLogin, ssoSignIn } from '../../firebase/sso';
import GoogleButton from 'react-google-button';
import Loader from '../Loader/Loader';
import './Login.css';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
    const {dispatch} = useContext(UserContext);
    const [checking, setChecking] = useState(true);

    // Use the existing Firebase user, or the shared killerkc12.in session if there is one.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const fbUser = auth.currentUser || await ssoSignIn(auth);
            if (cancelled) return;
            if (fbUser) await FinishLogin(fbUser);
            else if (!redirectToLogin()) setChecking(false); // only if a redirect just failed
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const FinishLogin = async (fbUser) => {
        let currentUser = await GetUser(fbUser.uid);
        if(currentUser === undefined){
            const uid = await AddUser(fbUser);
            const board_id = await AddBoard(uid);
            const tasklist_id = await AddTaskList(board_id, uid);
            await SetDefaultValues(uid,board_id,tasklist_id);
            currentUser = await GetUser(fbUser.uid);
        }
        const user = {
            uid: fbUser.uid,
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

    const AddTaskList = async (board_id, uid) => {
        const docRef = collection(db, 'TaskList');
        const data = {
            uid: uid,
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
    // Normally visitors never see this: they are sent to auth.killerkc12.in.
    // The button only shows if they came straight back without a session.
    return (
        <div className='login__container'>
            <div className='login__header'>
                <h2>TaskBoard</h2>
            </div>
            <div className='login__button'>
                {checking ? <Loader /> : (
                    <>
                        <p style={{ color: '#aaa', marginBottom: 16 }}>We couldn't sign you in automatically.</p>
                        <GoogleButton label='Sign in' onClick={goToLogin} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;