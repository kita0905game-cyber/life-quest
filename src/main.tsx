import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    // iOS may keep an installed PWA alive for days. Check for a newly
    // deployed worker while the game is open instead of waiting for Safari.
    window.setInterval(() => {
      void registration.update();
    }, 60_000);
  },
  onNeedRefresh() {
    void updateSW(true);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
