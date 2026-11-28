/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { IoIosArrowDown } from 'react-icons/io';
import { MdAdd, MdCheck, MdDelete, MdEdit } from 'react-icons/md';
import { auth, db } from '../../firebase/firebase';
import './BoardPicker.css';

// Header control for boards: switch, create, rename, delete.
const BoardPicker = ({ boards, current, onSwitch }) => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(null); // null | 'new' | 'rename'
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setMode(null); } };
        const esc = (e) => { if (e.key === 'Escape') { setOpen(false); setMode(null); } };
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', esc);
        return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
    }, [open]);

    const uid = () => auth.currentUser.uid;

    const createBoard = async () => {
        const board_name = name.trim();
        if (!board_name) return;
        setBusy(true);
        const board = await addDoc(collection(db, 'Board'), { board_name, uid: uid(), createdOn: new Date() });
        // Every new board starts with one list so there is somewhere to add tasks.
        await addDoc(collection(db, 'TaskList'), { uid: uid(), board_id: board.id, tasklist_name: 'To do', createdOn: new Date() });
        setBusy(false); setMode(null); setName(''); setOpen(false);
        onSwitch(board.id);
    };

    const renameBoard = async () => {
        const board_name = name.trim();
        if (!board_name || !current) return;
        await updateDoc(doc(db, 'Board', current.id), { board_name });
        setMode(null); setName('');
    };

    const deleteBoard = async () => {
        if (!current || boards.length < 2) return;
        if (!window.confirm(`Delete "${current.board_name}" and all its lists and tasks? This can't be undone.`)) return;
        setBusy(true);
        const next = boards.find((b) => b.id !== current.id);
        await onSwitch(next.id);
        // Delete the board, its lists and their tasks.
        const lists = await getDocs(query(collection(db, 'TaskList'), where('uid', '==', uid()), where('board_id', '==', current.id)));
        const batch = writeBatch(db);
        for (const l of lists.docs) {
            const tasks = await getDocs(query(collection(db, 'Task'), where('uid', '==', uid()), where('tasklist_id', '==', l.id)));
            tasks.docs.forEach((t) => batch.delete(t.ref));
            batch.delete(l.ref);
        }
        batch.delete(doc(db, 'Board', current.id));
        await batch.commit();
        setBusy(false); setOpen(false);
    };

    const onKey = (e, action) => { if (e.key === 'Enter') action(); };

    return (
        <div className="boardpicker" ref={ref}>
            <button type="button" className="boardpicker__current" onClick={() => setOpen(!open)} aria-expanded={open}>
                <h3>{current?.board_name || 'Board'}</h3>
                <IoIosArrowDown className={`boardpicker__caret${open ? ' is-open' : ''}`} />
            </button>

            {open && (
                <div className="boardpicker__menu" role="menu">
                    <p className="boardpicker__label">Your boards</p>
                    {boards.map((b) => (
                        <button type="button" key={b.id} role="menuitem" className="boardpicker__item"
                            onClick={() => { onSwitch(b.id); setOpen(false); }}>
                            <span>{b.board_name}</span>
                            {b.id === current?.id && <MdCheck className="boardpicker__check" />}
                        </button>
                    ))}

                    <div className="boardpicker__divider" />

                    {mode === 'new' ? (
                        <div className="boardpicker__form">
                            <input autoFocus placeholder="Board name" value={name} maxLength={60}
                                onChange={(e) => setName(e.target.value)} onKeyDown={(e) => onKey(e, createBoard)} />
                            <button type="button" disabled={busy || !name.trim()} onClick={createBoard}>Create</button>
                        </div>
                    ) : (
                        <button type="button" className="boardpicker__item" onClick={() => { setMode('new'); setName(''); }}>
                            <MdAdd /> <span>New board</span>
                        </button>
                    )}

                    {current && (mode === 'rename' ? (
                        <div className="boardpicker__form">
                            <input autoFocus value={name} maxLength={60}
                                onChange={(e) => setName(e.target.value)} onKeyDown={(e) => onKey(e, renameBoard)} />
                            <button type="button" disabled={!name.trim()} onClick={renameBoard}>Save</button>
                        </div>
                    ) : (
                        <button type="button" className="boardpicker__item" onClick={() => { setMode('rename'); setName(current.board_name); }}>
                            <MdEdit /> <span>Rename board</span>
                        </button>
                    ))}

                    {current && (
                        <button type="button" className="boardpicker__item boardpicker__danger"
                            disabled={busy || boards.length < 2} onClick={deleteBoard}
                            title={boards.length < 2 ? 'You need at least one board' : undefined}>
                            <MdDelete /> <span>Delete board</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BoardPicker;
