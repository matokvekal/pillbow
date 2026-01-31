import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

// Register PWA service worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Force reload when new version is available
    console.log("New version available! Reloading...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
  onRegisteredSW(swUrl, registration) {
    console.log("Service Worker registered:", swUrl);
    // Check for updates every 60 seconds
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60000);
    }
  },
  onRegisterError(error) {
    console.error("SW registration error", error);
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
