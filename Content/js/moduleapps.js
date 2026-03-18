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
