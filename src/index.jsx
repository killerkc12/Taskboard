import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import { initAnalytics, showUpdateToast } from '@killerkc12/shared';

// "Update now": make the waiting version take over, then reload. Done directly rather than via
// workbox-window's event, which misses the reload when several versions were deployed while the
// tab was open (the button then did nothing).
async function applyUpdate() {
  let reloading = false;
  const reload = () => { if (!reloading) { reloading = true; window.location.reload(); } };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    const waiting = reg?.waiting;
    if (waiting) {
      navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
      waiting.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(reload, 3000); // fallback if the switch is slow or already happened
      return;
    }
  } catch (e) { /* fall through to a plain reload */ }
  reload();
}

initAnalytics('taskboard');

// Service worker: offline app shell; when a new version is ready, offer a reload.
registerSW({ onNeedRefresh() { showUpdateToast(applyUpdate); } });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// The app started, so its files loaded: allow the offline-copy recovery to run again later.
setTimeout(() => { try { sessionStorage.removeItem('pwa_recover'); } catch { /* ignore */ } }, 5000);
