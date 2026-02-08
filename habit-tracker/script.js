const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Save to localStorage
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Render habits
function renderHabits() {
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit";

    const info = document.createElement("div");
    info.className = "habit-info";

    const name = document.createElement("span");
    name.textContent = habit.name;
    if (habit.completed) name.classList.add("completed");

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.textContent = `🔥 ${habit.streak}`;

    info.appendChild(name);
    info.appendChild(streak);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;

    checkbox.addEventListener("change", () => {
      habit.completed = checkbox.checked;

      if (habit.completed) {
        habit.streak += 1;
      }

      saveHabits();
      renderHabits();
    });

    li.appendChild(info);
    li.appendChild(checkbox);
    habitList.appendChild(li);
  });
}

// Add habit
habitInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const name = habitInput.value.trim();
  if (!name) return;

  // prevent duplicates
  if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) {
    alert("Habit already exists");
    return;
  }

  habits.push({
    name,
    completed: false,
    streak: 0
  });

  habitInput.value = "";
  saveHabits();
  renderHabits();
});

renderHabits();
