// ---------- Open/Close Windows ----------
function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return console.warn("Window not found:", id);

  el.classList.remove("hidden");
  el.style.display = "block";
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return console.warn("Window not found:", id);

  el.classList.add("hidden");
  el.style.display = "none";
}

// ---------- Draggable System ----------
let zIndexCounter = 100; // global z-index

function makeDraggable(windowEl) {
  const header = windowEl.querySelector(".window-titlebar");
  if (!header) return;

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function startDrag(e) {
    isDragging = true;
    bringToFront(windowEl);

    const rect = windowEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }

  function drag(e) {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    windowEl.style.left = (clientX - offsetX) + "px";
    windowEl.style.top = (clientY - offsetY) + "px";
  }

  function stopDrag() {
    isDragging = false;
  }

  // Mouse
  header.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  // Touch
  header.addEventListener("touchstart", startDrag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", stopDrag);
}

// Bring window to front
function bringToFront(windowEl) {
  zIndexCounter++;
  windowEl.style.zIndex = zIndexCounter;
}

// Initialize all draggable windows on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".appwindow").forEach(makeDraggable);
});
