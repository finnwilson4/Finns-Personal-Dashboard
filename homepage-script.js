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

function initializeStorage() {
    websiteInputs.forEach(setupStorage);
}


// RESIZING AND SAVING THE SIZE OF NOTES BOX
function initializeNotes() {
    const notes = document.getElementById("notes");

    function resizeNotes() {
        notes.style.height = "auto";
        notes.style.height = `${notes.scrollHeight}px`;
    }

    notes.addEventListener("input", resizeNotes);
    resizeNotes();
}


// TOGGLE DONE ON BINGO TABLE
function initializeBingoTable() {
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
}


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

function initializeProgressBars() {
    [
        ["carAmount", "carGoal", "carProgress"],
        ["holidayAmount", "holidayGoal", "holidayProgress"],
        ["readAmount", "readGoal", "readProgress"],
    ].forEach(ids => setupProgress(...ids));
}


// DISPLAY CURRENT DAY'S WORKOUT / TEA INFORMATION
function getTodayName() {
    const dayIndex = (new Date().getDay() + 6) % 7;
    return days[dayIndex];
}

function renderTodayWorkout() {
    const today = getTodayName();

    const workoutName = localStorage.getItem(`workout-${today.toLowerCase()}`);
    const workout = workouts[workoutName];
    const workoutContainer = document.getElementById("today-workout-card");

    if (!workoutName || !workout) {
        workoutContainer.innerHTML = `
            <div>
                <h3>Today's Workout</h3>
                <p>Rest Day</p>
            </div>
        `;
        return;
    }

    const rows = workout.exercises
        .map(exercise => `
            <tr>
                <td style="width: 50%;">${exercise.name}</td>
                <td style="width: 15%">${exercise.weight}</td>
                <td style="width: 35%; text-align: center">
                    ${exercise.muscle}
                </td>
            </tr>
        `)
        .join("");

    workoutContainer.innerHTML = `
        <div class="workout">
            <h3>Today's Workout: ${workout.name}</h3>
            <table class="workout-description-table">
                ${rows}
            </table>
        </div>
    `;
}

function missingIngredientsForTea(meal) {

    const stock = JSON.parse(localStorage.getItem("ingredientStock")) || {};
    const missing = {};

    for (const [ingredientKey, quantity] of Object.entries(meal.ingredients)) {

        const owned = Number(stock[ingredientKey]) || 0;

        if (owned < quantity) {missing[ingredientKey] = quantity - owned;}
    }
    return missing;
}

function renderTodayMeal() {
    const today = getTodayName();

    const mealsContainer = document.getElementById("today-meal-card");
    const mealSchedule = JSON.parse(localStorage.getItem("mealSchedule")) || {};
    const mealName = mealSchedule[today.toLowerCase()];
    const meal = meals[mealName];

    if (!meal) {
        mealsContainer.innerHTML = "<p>No meal planned.</p>";
        return;
    }

    let cost = 0;
    const missing = missingIngredientsForTea(meal);
    const missingHTML = Object.entries(missing)

    .map(([ingredientKey, qty]) => {
        const ingredient = ingredients[ingredientKey];
        const packsNeeded = Math.ceil(qty / ingredient.number);
        console.log(packsNeeded)

        cost += ingredient.price * packsNeeded;

        return `<li>${ingredient.name} x${qty}</li>`;
    })
    .join("");

    mealsContainer.innerHTML = `
        <div class="meal">
            <h3>Today's Tea: ${meal.name}</h3>

            <h3>Missing Ingredients</h3>
            <ul>
                ${missingHTML || "<li>All ingredients available</li>"}
            </ul>

            <h3>Price: £${cost.toFixed(2)}</h3>
        </div>
    `;

}

function init() {
    initializeStorage();
    initializeNotes();
    initializeBingoTable();
    initializeProgressBars();
    renderTodayWorkout();
    renderTodayMeal();
}

init();