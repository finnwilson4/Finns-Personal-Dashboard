containers = {
    workoutContainer: document.querySelector("#today-workout-card"),
    uniContainer: document.querySelector("#uni-summary"),
    financeContainer: document.querySelector("#finances-summary"),
}

let homepageData = {};
let workoutSchedule = {};

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

    element.value = homepageData[id] || "";

    element.addEventListener("input", async () => {
        homepageData[id] = element.value;

        await saveHomepageData();
    });
}

async function saveHomepageData() {

    const savedData = await loadDashboardData() || {};

    savedData.homepage = homepageData;

    const success = await saveDashboardData(savedData);

    if (!success) {
        console.error("Failed to save homepage data.");
    }
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

        const key = `bingo-${index}`;

        // Restore saved state
        if (homepageData[key] === true) {
            cell.classList.add("completed");
        } else {
            cell.classList.remove("completed");
        }

        // Toggle state when clicked
        cell.addEventListener("click", async () => {

            const completed = !cell.classList.contains("completed");

            cell.classList.toggle("completed", completed);

            homepageData[key] = completed;

            await saveHomepageData();
        });
    });
}

// PROGRESS TRACKER FOR GOALS
function setupProgress(amountId, goalId, progressId, balanceName = null) {

    const amountElement = document.getElementById(amountId);
    const goalInput = document.getElementById(goalId);
    const progressBar = document.getElementById(progressId);

    function getAmount() {
        if (balanceName) {
            return financeState.balances[balanceName];
        }
        return Number(amountElement.value) || 0;
    }

    function updateProgress() {

        const amount = getAmount();
        const goal = Number(goalInput.value) || 0;

        if (balanceName) {
            amountElement.textContent = `£${amount.toFixed(2)}`;
        }

        progressBar.value = amount;
        progressBar.max = goal;
    }

    if (!balanceName) {
        amountElement.addEventListener("input", updateProgress);
    }

    goalInput.addEventListener("input", updateProgress);

    updateProgress();
}

function initializeProgressBars() {
    [
        ["carAmount", "carGoal", "carProgress", "Car"],
        ["holidayAmount", "holidayGoal", "holidayProgress", "Holiday"],
        ["readAmount", "readGoal", "readProgress"],
    ].forEach(ids => setupProgress(...ids));
}

// DISPLAY CURRENT DAY'S WORKOUT / TEA INFORMATION
function getTodayName() {
    const dayIndex = (new Date().getDay() + 6) % 7;
    return days[dayIndex];
}

function renderTodayWorkout() {
    const today = getTodayName().toLowerCase();

    const workoutName = workoutSchedule[today];

    const workout = workouts[workoutName];
    
    if (!workoutName || !workout) {
        containers.workoutContainer.innerHTML = `
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

    containers.workoutContainer.innerHTML = `
        <div class="workout">
            <h3>Today's Workout: ${workout.name}</h3>
            <table class="workout-description-table">
                ${rows}
            </table>
        </div>
    `;
    
}

function missingIngredientsForTea(meal) {

    const stock = ingredientStock;
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
    const mealSchedule = schedule;
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

async function loadHomepageData() {

    const savedData = await loadDashboardData();

    if (!savedData) {
        console.log("No saved dashboard data found.");
        return;
    }

    // Load homepage-specific data
    homepageData = savedData.homepage || {};

    // Load workout data
    workoutSchedule = savedData.workoutSchedule || {};

    // Load meal planner data
    schedule = savedData.mealSchedule || {};
    ingredientStock = savedData.ingredientStock || {};

    // Load finance data
    if (savedData.financeState) {
        Object.assign(financeState, savedData.financeState);

        if (financeState.oneOffExpenses) {
            financeState.oneOffExpenses =
                financeState.oneOffExpenses.map(expense => ({
                    ...expense,
                    date: new Date(expense.date)
                }));
        }
    }

    console.log("Homepage data loaded from Supabase.");
}

async function init() {

    await loadHomepageData();

    initializeStorage();
    initializeNotes();
    initializeBingoTable();
    initializeProgressBars();
    renderTodayWorkout();
    renderTodayMeal();
}

init();
