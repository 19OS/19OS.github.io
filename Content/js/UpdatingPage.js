// ===============================
// 🔒 SYSTEM UPDATE LOCK (MANUAL)
// ===============================

// 1. ADD STYLES TO HEAD
const style = document.createElement('style');
style.textContent = `
  #systemUpdateLock {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: #000;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 999999;
  }
  .update-box {
    text-align: center;
    width: 300px;
  }
  .bar {
    width: 100%;
    height: 10px;
    background: #333;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
  }
  #barFill {
    width: 0%;
    height: 100%;
    background: #007bff;
    transition: width 0.3s ease;
  }
  h1 { font-size: 24px; margin-bottom: 10px; }
  #updateText { color: #aaa; font-size: 14px; }
  #percent { font-weight: bold; }
`;
document.head.appendChild(style);

let updateState = {
  started: false,
  progress: 0,
  interval: null
};

// -------------------------------
// 🔒 LOCK SCREEN
// -------------------------------
function showUpdateScreen() {
  if (document.getElementById("systemUpdateLock")) return;

  const overlay = document.createElement("div");
  overlay.id = "systemUpdateLock";

  overlay.innerHTML = `
    <div class="update-box">
      <h1>System Update</h1>
      <p id="updateText">Waiting to check for updates...</p>
      <div class="bar">
        <div id="barFill"></div>
      </div>
      <span id="percent">0%</span>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  
  // Auto-start for convenience (Optional)
  setTimeout(startUpdateCheck, 1000);
}

// -------------------------------
// 🔍 START CHECK
// -------------------------------
function startUpdateCheck() {
  if (updateState.started) return;

  updateState.started = true;

  const text = document.getElementById("updateText");
  const bar = document.getElementById("barFill");
  const percent = document.getElementById("percent");

  const stages = [
    "Checking for updates...",
    "Downloading components...",
    "Installing system files...",
    "Optimizing kernel...",
    "Finishing setup..."
  ];

  updateState.interval = setInterval(() => {
    // Increment progress
    updateState.progress += Math.random() * 4;

    if (updateState.progress >= 100) {
      updateState.progress = 100;
      clearInterval(updateState.interval);

      text.innerText = "Update Complete. Restarting...";
      bar.style.width = "100%";
      percent.innerText = "100%";

      setTimeout(finishUpdate, 2000);
      return;
    }

    // Update UI
    bar.style.width = updateState.progress + "%";
    percent.innerText = Math.floor(updateState.progress) + "%";

    // Logic Fix: Calculate stage index correctly without exceeding bounds
    const stageIndex = Math.min(Math.floor((updateState.progress / 100) * stages.length), stages.length - 1);
    text.innerText = stages[stageIndex];

  }, 200);
}

// -------------------------------
// 🔄 FINISH
// -------------------------------
function finishUpdate() {
  const overlay = document.getElementById("systemUpdateLock");
  if (overlay) overlay.remove();

  document.body.style.overflow = "";
  location.reload();
}

// To trigger:
// showUpdateScreen();
