function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("hidden");
}

document.addEventListener("click", (e) => {
  // OPEN
  const openBtn = e.target.closest("[data-open]");
  if (openBtn) {
    openWindow(openBtn.getAttribute("data-open"));
    return;
  }

  // CLOSE (FIXED)
  const closeBtn = e.target.closest(".close-btn");
  if (closeBtn) {
    const id = closeBtn.getAttribute("data-close");
    closeWindow(id);
  }
});
function makeDraggable(windowEl) {
  const header = windowEl.querySelector(".titlebar");
  if (!header) return;

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  function startDrag(e) {
    isDragging = true;

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
