/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdCheckCircle, MdClose } from 'react-icons/md';
import { auth, db } from '../../firebase/firebase';
import { describeDue } from '../../utils/dueDate';
import './Search.css';

const MAX_RESULTS = 8;

// Wraps the matching part of the name in <mark>.
const Highlight = ({ text, term }) => {
    const i = text.toLowerCase().indexOf(term.toLowerCase());
    if (!term || i < 0) return text;
    return <>{text.slice(0, i)}<mark>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>;
};

// After switching boards, scroll to the task and flash it (if it is showing).
const revealTask = (id) => {
    let tries = 0;
    const timer = setInterval(() => {
        const el = document.getElementById(`task-${id}`);
        if (el || ++tries > 30) {
            clearInterval(timer);
            if (!el) return;
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            el.classList.add('is-flash');
            setTimeout(() => el.classList.remove('is-flash'), 2200);
        }
    }, 80);
};

// Search box: finds tasks by name across all boards.
const Search = ({ boards, onSwitch }) => {
    const [term, setTerm] = useState('');
    const [focused, setFocused] = useState(false);
    const [active, setActive] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const wrap = useRef(null);
    const input = useRef(null);
    const open = focused && term.trim().length > 0;

    // Load tasks and lists once the box is used, and keep them live while it is.
    const wanted = focused || term.length > 0;
    useEffect(() => {
        if (!wanted || !auth.currentUser) return undefined;
        const uid = auth.currentUser.uid;
        const a = onSnapshot(query(collection(db, 'Task'), where('uid', '==', uid)), (s) => setTasks(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
        const b = onSnapshot(query(collection(db, 'TaskList'), where('uid', '==', uid)), (s) => setLists(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
        return () => { a(); b(); };
    }, [wanted]);

    // "/" focuses the search box from anywhere (unless already typing somewhere).
    useEffect(() => {
        const onKey = (e) => {
            const t = e.target;
            const typing = t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
            if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.current?.focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (!focused) return undefined;
        const onDown = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setFocused(false); };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [focused]);

    const results = useMemo(() => {
        const q = term.trim().toLowerCase();
        if (!q) return [];
        const listById = Object.fromEntries(lists.map((l) => [l.id, l]));
        const boardById = Object.fromEntries(boards.map((b) => [b.id, b]));
        return tasks
            .filter((t) => (t.task_name || '').toLowerCase().includes(q) && listById[t.tasklist_id])
            .map((t) => {
                const list = listById[t.tasklist_id];
                const name = t.task_name.toLowerCase();
                // Open tasks first, then names that start with the term, then alphabetical.
                const rank = (t.isCompleted ? 2 : 0) + (name.startsWith(q) ? 0 : 1);
                return { ...t, list, board: boardById[list.board_id], rank };
            })
            .sort((a, b) => a.rank - b.rank || a.task_name.localeCompare(b.task_name))
            .slice(0, MAX_RESULTS);
    }, [term, tasks, lists, boards]);

    useEffect(() => { setActive(0); }, [term]);

    const choose = (r) => {
        if (!r) return;
        setFocused(false);
        input.current?.blur();
        if (r.board) onSwitch(r.board.id);
        if (!r.isCompleted) revealTask(r.id);
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]); }
        else if (e.key === 'Escape') { if (term) setTerm(''); else input.current?.blur(); setFocused(false); }
    };

    return (
        <div className="navbar__middle search" ref={wrap}>
            <div className="search__logo_container">
                <AiOutlineSearch className="search__logo" />
            </div>
            <div className="input__container">
                <input
                    ref={input}
                    type="search"
                    placeholder="Search tasks"
                    className="search__input"
                    value={term}
                    onChange={(e) => { setTerm(e.target.value); setFocused(true); }}
                    onFocus={() => setFocused(true)}
                    onKeyDown={onKeyDown}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    aria-label="Search tasks"
                />
                {term ? (
                    <button type="button" className="search__clear" aria-label="Clear search" onClick={() => { setTerm(''); input.current?.focus(); }}><MdClose /></button>
                ) : (
                    <kbd className="search__hint" title="Press / to search">/</kbd>
                )}
            </div>

            {open && (
                <div className="search__panel" id="search-results" role="listbox">
                    {results.length === 0 ? (
                        <p className="search__empty">No tasks match “{term.trim()}”.</p>
                    ) : results.map((r, i) => {
                        const due = !r.isCompleted && describeDue(r.due_date);
                        return (
                            <button
                                type="button"
                                key={r.id}
                                role="option"
                                aria-selected={i === active}
                                className={`search__result${i === active ? ' is-active' : ''}${r.isCompleted ? ' is-done' : ''}`}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => choose(r)}
                            >
                                <span className="search__name">
                                    {r.isCompleted && <MdCheckCircle className="search__done-icon" />}
                                    <span className="search__text"><Highlight text={r.task_name} term={term.trim()} /></span>
                                </span>
                                <span className="search__meta">
                                    {due && <span className={`search__chip search__chip--${due.tone}`}>{due.label}</span>}
                                    {r.isCompleted && <span className="search__chip search__chip--done">Completed</span>}
                                    <span className="search__where">{r.board?.board_name} · {r.list?.tasklist_name}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Search;
