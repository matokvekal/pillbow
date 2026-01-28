
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registration successful:', registration);
      },
      (err) => {
        console.log('Service Worker registration failed:', err);
      }
    );
  });
}


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
