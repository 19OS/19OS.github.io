const CrashLogger = {
  logs: [],
  MAX_LOGS: 50, // Prevent localStorage bloat

  /**
   * Initializes the logger and sets up global listeners
   */
  init() {
    this.load();

    // Catch unhandled runtime errors
    window.addEventListener("error", (event) => {
      this.log(event.error || event.message, "runtime", false);
    });

    // Catch unhandled promise rejections (async/await)
    window.addEventListener("unhandledrejection", (event) => {
      this.log(event.reason, "promise", false);
    });
  },

  log(error, source = "system", fatal = false) {
    const entry = {
      id: Date.now(),
      time: new Date().toISOString(), // Better for sorting/parsing
      source,
      message: error?.message || String(error),
      stack: error?.stack || "No stack trace available",
      fatal
    };

    // Keep logs under the limit (FIFO)
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) this.logs.shift();
    
    this.save();
    console.error(`%c 💥 Crash [${source}]:`, "color: red; font-weight: bold;", entry);

    if (fatal) {
      this.showBSOD(entry);
    } else {
      this.showCrashWindow(entry);
    }
  },

  save() {
    try {
      localStorage.setItem("19os_crash_logs", JSON.stringify(this.logs));
    } catch (e) {
      console.warn("Failed to save logs to localStorage:", e);
    }
  },

  load() {
    try {
      const saved = localStorage.getItem("19os_crash_logs");
      this.logs = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.logs = [];
    }
  },

  clear() {
    this.logs = [];
    localStorage.removeItem("19os_crash_logs");
  },

  showCrashWindow(entry) {
    const crashBox = document.createElement("div");
    // Using a class + inline styles for guaranteed visibility
    Object.assign(crashBox.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      background: "#333",
      color: "#fff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      fontFamily: "monospace",
      maxWidth: "300px"
    });

    crashBox.innerHTML = `
      <div style="color: #ff5555; font-weight: bold; margin-bottom: 10px;">⚠️ APP CRASH</div>
      <div style="font-size: 12px; margin-bottom: 10px;">
        <b>Source:</b> ${entry.source}<br>
        <b>Error:</b> ${entry.message}
      </div>
      <button id="crash-close-btn" style="cursor: pointer;">Dismiss</button>
    `;

    document.body.appendChild(crashBox);
    crashBox.querySelector("#crash-close-btn").onclick = () => crashBox.remove();
  },

  showBSOD(entry) {
    // Stop the world: Overwrite CSS to ensure the BSOD is visible
    const style = document.createElement('style');
    style.innerHTML = `
      body { margin: 0; padding: 0; overflow: hidden; background: #0078d7 !important; color: white !important; font-family: 'Segoe UI', sans-serif; }
      .bsod { height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 10%; }
      .qr-code { width: 100px; height: 100px; background: white; margin-top: 20px; }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = `
      <div class="bsod">
        <div style="font-size: 100px;">:(</div>
        <h1>Your 19OS ran into a problem and needs to restart.</h1>
        <p>We're just collecting some error info, and then we'll restart for you.</p>
        <div style="font-size: 1.2rem; margin-top: 20px;">
          Stop Code: <span style="font-family: monospace;">${entry.message.toUpperCase().replace(/\s+/g, '_')}</span>
        </div>
        <p style="opacity: 0.8;">Source: ${entry.source}</p>
        <button onclick="location.reload()" style="margin-top: 30px; padding: 10px 20px; background: white; border: none; cursor: pointer;">Restart 19OS</button>
      </div>
    `;
  }
};

// Initialize the logger
CrashLogger.init();
