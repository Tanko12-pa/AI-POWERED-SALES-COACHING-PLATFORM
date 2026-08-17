import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle benign third-party DOM lifecycle rejections & background network glitches
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = typeof reason === 'string' ? reason : (reason?.message || reason?.toString() || '');
  if (
    msg.includes('Detected container element removed from DOM') ||
    msg.includes('paypal') ||
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('fetch')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('Detected container element removed from DOM') ||
    msg.includes('Failed to fetch') ||
    msg.includes('paypal')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

