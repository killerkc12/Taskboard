/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';

// Shared app switcher for killerkc12.in apps. Same file in FinTrack Pro, MasteryTech and
// TaskBoard (this JS copy) — keep them identical. Styles are inline so it looks the same
// regardless of each app's CSS setup.

const APPS = [
  { id: 'fintrack', name: 'FinTrack Pro', text: 'Money, cards and loans', url: 'https://fintrackpro.killerkc12.in/', color: '#4f46e5', mark: 'FP' },
  { id: 'masterytech', name: 'MasteryTech', text: 'System design, DBA, DSA', url: 'https://masterytech.killerkc12.in/', color: '#5A5A40', mark: 'M' },
  { id: 'taskboard', name: 'TaskBoard', text: 'Lists and tasks', url: 'https://taskboard.killerkc12.in/', color: '#2684fc', mark: 'TB' },
];

const s = {
  wrap: { position: 'relative', display: 'inline-block', fontFamily: 'Inter, system-ui, sans-serif' },
  button: { width: 40, height: 40, borderRadius: 10, border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'inherit' },
  panel: { position: 'absolute', right: 0, top: 46, width: 280, maxWidth: 'calc(100vw - 24px)', background: '#fff', color: '#111827', borderRadius: 16, boxShadow: '0 20px 40px -12px rgba(0,0,0,.35)', border: '1px solid #e5e7eb', padding: 8, zIndex: 1000 },
  heading: { fontSize: 12, fontWeight: 600, color: '#6b7280', padding: '8px 10px 6px', margin: 0 },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 12, textDecoration: 'none', color: '#111827' },
  mark: { width: 36, height: 36, borderRadius: 10, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, flex: 'none' },
  name: { fontSize: 15, fontWeight: 600, lineHeight: 1.2, margin: 0 },
  text: { fontSize: 12, color: '#6b7280', margin: '2px 0 0' },
  here: { marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#6b7280' },
  footer: { display: 'block', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '10px', marginTop: 4, borderTop: '1px solid #f3f4f6' },
};

export const AppSwitcher = ({ current }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} style={s.wrap}>
      <button type="button" style={s.button} aria-label="Switch app" aria-expanded={open} title="Switch app" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          {[3, 10, 17].flatMap((x) => [3, 10, 17].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />))}
        </svg>
      </button>
      {open && (
        <div style={s.panel} role="menu">
          <p style={s.heading}>killerkc12.in apps</p>
          {APPS.map((a) => (
            <a key={a.id} href={a.url} role="menuitem" style={{ ...s.item, background: a.id === current ? '#f3f4f6' : undefined }}
               onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
               onMouseLeave={(e) => { e.currentTarget.style.background = a.id === current ? '#f3f4f6' : ''; }}>
              <span style={{ ...s.mark, background: a.color }}>{a.mark}</span>
              <span><p style={s.name}>{a.name}</p><p style={s.text}>{a.text}</p></span>
              {a.id === current && <span style={s.here}>Here</span>}
            </a>
          ))}
          <a href="https://killerkc12.in/" style={s.footer}>All projects →</a>
        </div>
      )}
    </div>
  );
};
