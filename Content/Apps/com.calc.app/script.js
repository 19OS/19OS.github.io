const display = document.getElementById("display");
const liveResult = document.getElementById("liveResult");
const historyList = document.getElementById("history");

let history = [];

// 🔒 Clean expression
function sanitize(expr) {
  return expr
    .replace(/[^0-9+\-*/.^()%]/g, "")
    .replace(/(\.\.)+/g, ".")
    .replace(/([+\-*/^]){2,}/g, "$1")
    .replace(/^([*/^])/, "");
}

// ❗ Check if incomplete
function isIncomplete(expr) {
  return /[+\-*/.^]$/.test(expr);
}

// 🧠 Safe eval
function safeEval(expr) {
  if (!expr) return "";

  expr = sanitize(expr).replace(/\^/g, "**");

  try {
    const result = eval(expr);
    if (!isFinite(result)) return "Error";
    return result;
  } catch {
    return "";
  }
}

// ✨ LIVE RESULT
function updateLive() {
  const expr = display.value;

  if (!expr || isIncomplete(expr)) {
    liveResult.textContent = "= …";
    return;
  }

  const result = safeEval(expr);

  if (result === "" || result === "Error") {
    liveResult.textContent = "= …";
  } else {
    liveResult.textContent = "= " + result;
  }
}

// ➕ Input
function add(value) {
  if (display.value === "Error") display.value = "";

  display.value = sanitize(display.value + value);
  updateLive();
}

function clearDisplay() {
  display.value = "";
  updateLive();
}

function backspace() {
  display.value = display.value.slice(0, -1);
  updateLive();
}

// 🎯 Calculate
function calculate() {
  let expr = display.value;

  if (isIncomplete(expr)) {
    expr = expr.slice(0, -1);
  }

  const result = safeEval(expr);

  if (result === "" || result === "Error") {
    display.value = "Error";
    liveResult.textContent = "= ?";
    return;
  }

  display.value = result;
  liveResult.textContent = "= " + result;

  addHistory(expr + " = " + result);
}

// 📜 History
function addHistory(entry) {
  history.unshift(entry);
  if (history.length > 10) history.pop();

  if (historyList) {
    historyList.innerHTML = "";
    history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;

      li.onclick = () => {
        display.value = item.split("=")[0].trim();
        updateLive();
      };

      historyList.appendChild(li);
    });
  }
}

// ⌨️ Keyboard
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) return;

  const key = e.key;

  if (/^[0-9]$/.test(key) || "+-*/.^()".includes(key)) {
    e.preventDefault();
    add(key);
  }

  if (key === "Enter") {
    e.preventDefault();
    calculate();
  }

  if (key === "Backspace") {
    e.preventDefault();
    backspace();
  }

  if (key === "Escape") {
    clearDisplay();
  }
});
