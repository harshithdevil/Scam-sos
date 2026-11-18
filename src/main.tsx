import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Clean up any prior dev-mode Service Worker registrations that can serve stale ?v= React chunks
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        reg.unregister().catch(() => {});
      }
    });
  } else {
    registerSW({
      immediate: true,
      onOfflineReady() {
        document.documentElement.dataset.swReady = 'true';
      },
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
