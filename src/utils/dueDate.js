// Due dates are stored on tasks as 'YYYY-MM-DD' strings (the user's local date).

const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Label and tone for a due date: tone is 'overdue' | 'today' | 'soon' | 'later'. */
export function describeDue(due, now = new Date()) {
    if (!due) return null;
    const [y, m, d] = due.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((date - today) / 86400000);
    const short = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    if (days < 0) return { label: `Overdue · ${short}`, tone: 'overdue' };
    if (days === 0) return { label: 'Today', tone: 'today' };
    if (days === 1) return { label: 'Tomorrow', tone: 'soon' };
    if (days < 7) return { label: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }), tone: 'soon' };
    return { label: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined }), tone: 'later' };
}

/** Open tasks: ones with a due date first (soonest first), then the rest newest first. */
export function sortOpenTasks(a, b) {
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    const ta = a.createdOn?.seconds ?? 0, tb = b.createdOn?.seconds ?? 0;
    return tb - ta;
}
