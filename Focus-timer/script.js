// ===== DURATIONS (seconds) =====
let focusTime = 25 * 60;
let breakTime = 5 * 60;

// ===== STATE =====
let time = focusTime;
let isFocus = true;
let timerInterval = null;

// ===== ELEMENTS =====
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const sessionDisplay = document.getElementById("sessions");

// ===== SESSIONS (PERSISTENT) =====
let sessions = Number(localStorage.getItem("sessions")) || 0;
sessionDisplay.textContent = sessions;

// ===== FUNCTIONS =====
function updateTimer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function switchMode() {
  if (isFocus) {
    // finished focus → count session, go to break
    sessions++;
    localStorage.setItem("sessions", sessions);
    sessionDisplay.textContent = sessions;
    time = breakTime;
    modeDisplay.textContent = "Break Time";
  } else {
    // finished break → go back to focus
    time = focusTime;
    modeDisplay.textContent = "Focus Time";
  }
  isFocus = !isFocus;
  updateTimer();
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    time--;
    updateTimer();

    if (time <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      switchMode();
      startTimer(); // auto-start next mode
    }
  }, 1000);
}

// ===== BUTTONS =====
startBtn.onclick = startTimer;

pauseBtn.onclick = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

resetBtn.onclick = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isFocus = true;
  time = focusTime;
  modeDisplay.textContent = "Focus Time";
  updateTimer();
};

// ===== INIT =====
updateTimer();
