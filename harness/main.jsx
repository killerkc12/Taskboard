import React, { useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import '../src/App.css';
import { UserContext } from '../src/App';
import { reducer } from '../src/reducers/userReducer';
import Home from '../src/components/Home/Home';
import { __seed, __store } from 'firebase/firestore';

const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
__seed({
  User: { u1: { name: 'Kiran', default_board: 'b1' } },
  Board: { b1: { board_name: 'Main board', uid: 'u1', createdOn: { seconds: 1 } }, b2: { board_name: 'Side project', uid: 'u1', createdOn: { seconds: 2 } } },
  TaskList: { l1: { uid: 'u1', board_id: 'b1', tasklist_name: 'To do', createdOn: 1 }, l2: { uid: 'u1', board_id: 'b1', tasklist_name: 'This week', createdOn: 2 }, l3: { uid: 'u1', board_id: 'b2', tasklist_name: 'Ideas', createdOn: 1 } },
  Task: {
    t1: { uid: 'u1', tasklist_id: 'l1', task_name: 'Renew passport', createdOn: { seconds: 3 } },
    t2: { uid: 'u1', tasklist_id: 'l1', task_name: 'Pay electricity bill', due_date: day(-2), createdOn: { seconds: 2 } },
    t3: { uid: 'u1', tasklist_id: 'l2', task_name: 'Finish API review', due_date: day(0), createdOn: { seconds: 1 } },
    t4: { uid: 'u1', tasklist_id: 'l3', task_name: 'Blog post idea', createdOn: { seconds: 1 } },
  },
});
window.__store = __store;

function Harness() {
  const [state, dispatch] = useReducer(reducer, { uid: 'u1', name: 'Kiran', photo: '', default_board: 'b1' });
  return <UserContext.Provider value={{ state, dispatch }}><Home /></UserContext.Provider>;
}
createRoot(document.getElementById('root')).render(<Harness />);
