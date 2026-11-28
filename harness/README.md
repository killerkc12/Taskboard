# TaskBoard UI harness

Runs the real board screen (`Home`, lists, tasks, board picker) against an in-memory stand-in
for Firestore and Firebase Auth, so drag-and-drop, due dates and boards can be tried without
signing in or touching real data.

```bash
npx vite -c harness/vite.config.js      # open the printed address
```

Sample boards, lists and tasks are seeded in `harness/main.jsx`. Nothing here is deployed.
