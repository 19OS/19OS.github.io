// ===============================
// 🧠 19OS Focus Mode System (CORE)
// ===============================

const FocusModes = {
  // Use a getter/setter approach for cleaner state management
  current: localStorage.getItem("focusMode") || "default",
  notificationsEnabled: true,

  modes: {
    default: { name: "Default", theme: "light", notifications: true },
    gaming:  { name: "Gaming",  theme: "dark",  notifications: false },
    coding:  { name: "Coding",  theme: "matrix", notifications: false },
    chill:   { name: "Chill",   theme: "blur",   notifications: true }
  },

  apply(modeName) {
    const mode = this.modes[modeName];
    if (!mode) return;

    this.current = modeName;
    localStorage.setItem("focusMode", modeName);

    // Update internal state BEFORE notifying
    this.notificationsEnabled = mode.notifications;
    
    this.applyTheme(mode.theme);
    this.dispatchEvent(mode);

    // Optional: Notify user of the change
    console.log(`System: Switched to ${mode.name} mode.`);
    this.notify(`Mode: ${mode.name}`);
  },

  applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
  },

  notify(msg) {
    // Check global state
    if (!this.notificationsEnabled) return;

    const n = document.createElement("div");
    n.className = "notification";
    n.innerText = msg;

    document.body.appendChild(n);
    
    // Use a class for the fade-out animation instead of just removing
    setTimeout(() => {
      n.style.opacity = "0";
      setTimeout(() => n.remove(), 500);
    }, 2500);
  },

  dispatchEvent(mode) {
    window.dispatchEvent(new CustomEvent("focusChange", {
      detail: mode
    }));
  }
};

// Global Helpers
const setFocusMode = (mode) => FocusModes.apply(mode);
const getFocusMode = () => FocusModes.current;

// Auto apply on load
window.addEventListener("DOMContentLoaded", () => {
  FocusModes.apply(FocusModes.current);
});
