// =====================
// MODE & TIMER CONFIG
// =====================
const MODE_TIMES = {
    study: 25 * 60,
    work: 50 * 60,
    chill: null
};

let currentMode = "study";
let timeLeft = MODE_TIMES.study;
let timerInterval = null;

// =====================
// ELEMENTS
// =====================
const timerEl = document.getElementById("timer");
const modeText = document.getElementById("modeText");
const modeButtons = document.querySelectorAll(".modes button");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const mainGoalInput = document.getElementById("mainGoalInput");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskProgress = document.getElementById("taskProgress");

const themeToggle = document.getElementById("themeToggle");

// =====================
// STORAGE (LOAD)
// =====================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
mainGoalInput.value = localStorage.getItem("mainGoal") || "";

// Theme load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light");
}

// =====================
// TIMER FUNCTIONS
// =====================
function updateTimer() {
    if (timeLeft === null) {
        timerEl.textContent = "--:--";
        return;
    }

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    timerEl.textContent = `${mins}:${secs}`;
}

function startTimer() {
    if (timerInterval || timeLeft === null) return;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODE_TIMES[currentMode];
    updateTimer();
}

// =====================
// MODE SWITCHING
// =====================
modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentMode = btn.dataset.mode;
        modeText.textContent = `Mode: ${btn.textContent}`;
        timeLeft = MODE_TIMES[currentMode];
        resetTimer();
    });
});

// =====================
// TASKS + PROGRESS
// =====================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskProgress() {
    const completed = tasks.filter(t => t.completed).length;
    taskProgress.textContent = `${completed} / ${tasks.length} completed`;
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) span.classList.add("done");

        li.appendChild(checkbox);
        li.appendChild(span);
        taskList.appendChild(li);
    });

    updateTaskProgress();
}

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && taskInput.value.trim()) {
        tasks.push({
            text: taskInput.value.trim(),
            completed: false
        });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
});

// =====================
// MAIN GOAL
// =====================
mainGoalInput.addEventListener("input", () => {
    localStorage.setItem("mainGoal", mainGoalInput.value);
});

// =====================
// THEME TOGGLE
// =====================
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const theme =
        document.body.classList.contains("light") ? "light" : "dark";

    localStorage.setItem("theme", theme);
});

// =====================
// BUTTON EVENTS
// =====================
startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;

// =====================
// INIT
// =====================
updateTimer();
renderTasks();
