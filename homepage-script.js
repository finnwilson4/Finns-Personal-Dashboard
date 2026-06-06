// DEFINE WEBSITE HOMEPAGE INPUTS
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



// SAVE WEBSITE HOMEPAGE INPUTS
function setupStorage(id) {
    const element = document.getElementById(id);

    element.value = localStorage.getItem(id) || "";

    element.addEventListener("input", () => {
        localStorage.setItem(id, element.value);
    });
}

websiteInputs.forEach(setupStorage);



// RESIZING AND SAVING THE SIZE OF NOTES BOX
const notes = document.getElementById("notes");

function resizeNotes() {
  notes.style.height = "auto";
  notes.style.height = `${notes.scrollHeight}px`;
}

notes.addEventListener("input", resizeNotes);
resizeNotes();



// TOGGLE DONE ON BINGO TABLE
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



// PROGRESS TRACKER FOR GOALS

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



// DISPLAY CURRENT DAY'S WORKOUT INFORMATION

const dayIndex = (new Date().getDay() + 6) % 7;
const today = days[dayIndex];

const workoutName = localStorage.getItem(`workout-${today.toLowerCase()}`);

const workout = workouts[workoutName];

const container = document.getElementById("today-workout-card");

// set workout data; rest day if no workout
if (!workoutName || !workout) {
    container.innerHTML = `
        <div>
            <h3>Today's Workout</h3>
            <p>Rest Day</p>
        </div>
    `;
} else {
    let rows = "";
    workout.exercises.forEach(exercise => {
        rows += `
            <tr>
                <td style="width: 50%">${exercise.name}</td>
                <td style="width: 15%">${exercise.weight}</td>
                <td style="width: 35%">${exercise.muscle}</td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="workout">
            <h3>Today's Workout: ${workout.name}</h3>

            <table class="workout-description-table">${rows}</table>
        </div>
    `;
}
