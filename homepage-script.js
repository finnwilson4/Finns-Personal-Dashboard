
const websiteInputs = [
    "bookName",
    "author",
    "dateStarted",
    "pages",

    "readingDays",
    "workoutDays",
    "waterDays",

    "notes",

    "carGoal", "carAmount",
    "holidayGoal", "holidayAmount",
    "readGoal", "readAmount",
];

// Saving Website Inputs
function setupStorage(id) {
  const element = document.getElementById(id);

  element.value = localStorage.getItem(id) || "";

  element.addEventListener("input", () => {
    localStorage.setItem(id, element.value);
  });
}

websiteInputs.forEach(setupStorage);

// Resizing and saving the size of notes box
const notes = document.getElementById("notes");

function resizeNotes() {
  notes.style.height = "auto";
  notes.style.height = `${notes.scrollHeight}px`;
}

notes.addEventListener("input", resizeNotes);
resizeNotes();

// Toggle Done on Bingo Table
const bingoCells = document.querySelectorAll(".bingo-table td");

bingoCells.forEach((cell, index) => {
  const saved = localStorage.getItem(`bingo-${index}`);

  if (saved === "true") {
    cell.classList.add("completed");
  }

  cell.addEventListener("click", () => {
    cell.classList.toggle("completed");

    localStorage.setItem(
      `bingo-${index}`,
      cell.classList.contains("completed")
    );
  });
});

const goalInput = document.getElementById("carAmount");
const currentInput = document.getElementById("currentAmount");

const progressBar = document.getElementById("savingsProgress");
const progressText = document.getElementById("savingsText");

function setupProgress(amountId, goalId, progressId) {

    const amountInput = document.getElementById(amountId);
    const goalInput = document.getElementById(goalId);
    const progressBar = document.getElementById(progressId);

    function updateProgress() {

        const amount = Number(amountInput.value) || 0;
        const goal = Number(goalInput.value) || 0;

        progressBar.value = amount;
        progressBar.max = goal;
    }

    amountInput.addEventListener("input", updateProgress);
    goalInput.addEventListener("input", updateProgress);

    updateProgress();
}

[
    ["carAmount", "carGoal", "carProgress"],
    ["holidayAmount", "holidayGoal", "holidayProgress"],
    ["readAmount", "readGoal", "readProgress"],
].forEach(ids => setupProgress(...ids));

goalInput.addEventListener("input", updateProgress);
currentInput.addEventListener("input", updateProgress);

updateProgress();