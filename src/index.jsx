import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import { initAnalytics, showUpdateToast } from '@killerkc12/shared';

initAnalytics('taskboard');

// Service worker: offline app shell; when a new version is ready, offer a reload.
const updateSW = registerSW({ onNeedRefresh() { showUpdateToast(() => updateSW(true)); } });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// The app started, so its files loaded: allow the offline-copy recovery to run again later.
setTimeout(() => { try { sessionStorage.removeItem('pwa_recover'); } catch { /* ignore */ } }, 5000);
