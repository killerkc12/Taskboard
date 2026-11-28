/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { MdAdd, MdClose, MdDashboard, MdDragIndicator, MdEvent, MdKeyboardReturn, MdLogout, MdPalette } from 'react-icons/md';
import { ssoSignOut } from '@killerkc12/shared';
import { UserContext } from '../../App';
import { auth, db } from '../../firebase/firebase';
import { describeDue, toKey } from '../../utils/dueDate';
import { createBoard } from '../BoardPicker/BoardPicker';
import './Sidebar.css';

const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return toKey(d); };

// Slide-out menu: profile, overview across all boards, due soon, boards, tips, sign out.
const Sidebar = ({ open, onClose, boards, currentId, onSwitch }) => {
    const { state, dispatch } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const panel = useRef(null);

    // Live data only while the menu is open.
    useEffect(() => {
        if (!open) return undefined;
        const uid = auth.currentUser.uid;
        const offTasks = onSnapshot(query(collection(db, 'Task'), where('uid', '==', uid)),
            (s) => setTasks(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
        const offLists = onSnapshot(query(collection(db, 'TaskList'), where('uid', '==', uid)),
            (s) => setLists(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
        return () => { offTasks(); offLists(); };
    }, [open]);

    // Escape closes; focus moves into the menu once when it opens.
    const closeRef = useRef(onClose);
    closeRef.current = onClose;
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') closeRef.current(); };
        document.addEventListener('keydown', onKey);
        panel.current?.focus();
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const { stats, dueSoon, openByBoard } = useMemo(() => {
        const listById = Object.fromEntries(lists.map((l) => [l.id, l]));
        const boardById = Object.fromEntries(boards.map((b) => [b.id, b]));
        const today = inDays(0), week = inDays(7);
        const openTasks = tasks.filter((t) => !t.isCompleted && listById[t.tasklist_id]);
        const count = (fn) => openTasks.filter(fn).length;
        const byBoard = {};
        openTasks.forEach((t) => { const b = listById[t.tasklist_id].board_id; byBoard[b] = (byBoard[b] || 0) + 1; });
        const soon = openTasks
            .filter((t) => t.due_date && t.due_date <= week)
            .sort((a, b) => a.due_date.localeCompare(b.due_date))
            .slice(0, 6)
            .map((t) => {
                const list = listById[t.tasklist_id];
                return { ...t, board: boardById[list.board_id], list };
            });
        return {
            stats: {
                overdue: count((t) => t.due_date && t.due_date < today),
                today: count((t) => t.due_date === today),
                week: count((t) => t.due_date && t.due_date > today && t.due_date <= week),
                open: openTasks.length,
            },
            dueSoon: soon,
            openByBoard: byBoard,
        };
    }, [tasks, lists, boards]);

    const go = (boardId) => { if (boardId) onSwitch(boardId); onClose(); };

    const addBoard = async () => {
        const name = newName.trim();
        if (!name) return;
        const id = await createBoard(name);
        setNewName(''); setAdding(false);
        go(id);
    };

    const logout = async () => {
        await ssoSignOut(auth);
        localStorage.clear();
        dispatch({ type: 'CLEAR' });
    };

    return (
        <div className={`sidebar${open ? ' is-open' : ''}`} aria-hidden={!open}>
            <div className="sidebar__backdrop" onClick={onClose} />
            <aside className="sidebar__panel" ref={panel} tabIndex={-1} role="dialog" aria-label="Menu">
                <div className="sidebar__head">
                    {state?.photo ? <img src={state.photo} alt="" className="sidebar__avatar" referrerPolicy="no-referrer" />
                        : <span className="sidebar__avatar sidebar__avatar--blank">{(state?.name || '?')[0]}</span>}
                    <div className="sidebar__who">
                        <strong>{state?.name || 'Your account'}</strong>
                        <span>{state?.email || auth.currentUser?.email || ''}</span>
                    </div>
                    <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close menu"><MdClose /></button>
                </div>

                <section className="sidebar__section">
                    <h4>Overview</h4>
                    <div className="sidebar__stats">
                        <div className={`sidebar__stat${stats.overdue ? ' is-alert' : ''}`}><b>{stats.overdue}</b><span>Overdue</span></div>
                        <div className={`sidebar__stat${stats.today ? ' is-warn' : ''}`}><b>{stats.today}</b><span>Due today</span></div>
                        <div className="sidebar__stat"><b>{stats.week}</b><span>Next 7 days</span></div>
                        <div className="sidebar__stat"><b>{stats.open}</b><span>Open tasks</span></div>
                    </div>
                </section>

                <section className="sidebar__section">
                    <h4>Due soon</h4>
                    {dueSoon.length === 0 ? (
                        <p className="sidebar__empty">Nothing due in the next 7 days. Set due dates from a task's ⋮ menu.</p>
                    ) : (
                        <ul className="sidebar__due">
                            {dueSoon.map((t) => {
                                const info = describeDue(t.due_date);
                                return (
                                    <li key={t.id}>
                                        <button type="button" onClick={() => go(t.board?.id)}>
                                            <span className="sidebar__due-name">{t.task_name}</span>
                                            <span className="sidebar__due-meta">
                                                <span className={`sidebar__chip sidebar__chip--${info.tone}`}>{info.label}</span>
                                                <span className="sidebar__where">{t.board?.board_name} · {t.list?.tasklist_name}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <section className="sidebar__section">
                    <h4>Boards</h4>
                    <ul className="sidebar__boards">
                        {boards.map((b) => (
                            <li key={b.id}>
                                <button type="button" className={b.id === currentId ? 'is-active' : ''} onClick={() => go(b.id)}>
                                    <MdDashboard /><span>{b.board_name}</span>
                                    {openByBoard[b.id] ? <em>{openByBoard[b.id]}</em> : null}
                                </button>
                            </li>
                        ))}
                        <li>
                            {adding ? (
                                <div className="sidebar__new">
                                    <input autoFocus placeholder="Board name" value={newName} maxLength={60}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') addBoard(); if (e.key === 'Escape') { e.stopPropagation(); setAdding(false); } }} />
                                    <button type="button" disabled={!newName.trim()} onClick={addBoard}>Create</button>
                                </div>
                            ) : (
                                <button type="button" className="sidebar__add" onClick={() => setAdding(true)}><MdAdd /><span>New board</span></button>
                            )}
                        </li>
                    </ul>
                </section>

                <section className="sidebar__section">
                    <h4>Tips</h4>
                    <ul className="sidebar__tips">
                        <li><MdKeyboardReturn /> Type a task and press Enter to add it.</li>
                        <li><MdDragIndicator /> Drag a task by its handle to another list. On phones, press and hold first.</li>
                        <li><MdEvent /> Pick Today, Tomorrow or Next week from a task's ⋮ menu.</li>
                        <li><MdPalette /> Colour a list from its ⋮ menu.</li>
                    </ul>
                </section>

                <div className="sidebar__foot">
                    <button type="button" className="sidebar__logout" onClick={logout}><MdLogout /> Sign out of all apps</button>
                    <a href="https://killerkc12.in/" className="sidebar__more">More from killerkc12</a>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
