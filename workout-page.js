const container = document.getElementById("workout-container");
const scheduleContainer = document.getElementById("schedule-container");

let workoutSchedule = {};
let workoutOptions = "";

// Populate Workout Types
function generateWorkouts() {
    for (const workout of Object.values(workouts)) {
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

        container.innerHTML += `
            <div class="card workout">
                <h2>${workout.name}</h2>

                <table class="workout-description-table">
                    ${rows}
                </table>
            </div>
        `;
    }

    // Generate workout options
    workoutOptions = `
        <option value="">Rest Day</option>
    `;

    for (const [key, workout] of Object.entries(workouts)) {
        workoutOptions += `
            <option value="${key}">
                ${workout.name}
            </option>
        `;
    }
}

function generateWorkoutSchedule() {
    // Generate schedule table
    let headers = "";
    let selects = "";

    days.forEach(day => {

        headers += `
            <th>${day}</th>
        `;

        selects += `
            <td>
                <select class="workout-select" data-day="${day.toLowerCase()}">
                    ${workoutOptions}
                </select>
            </td>
        `;
    });

    scheduleContainer.innerHTML = `
        <table class="workout-schedule-table">
            <tr>${headers}</tr>
            <tr>${selects}</tr>
        </table>
    `;
}
async function loadWorkoutData() {

    const savedData = await loadDashboardData();

    if (savedData && savedData.workoutSchedule) {
        workoutSchedule = savedData.workoutSchedule;
    }

    console.log("Workout data loaded from Supabase.");
}

async function saveWorkoutData() {

    const savedData = await loadDashboardData() || {};

    savedData.workoutSchedule = workoutSchedule;

    const success = await saveDashboardData(savedData);

    if (!success) {
        console.error("Failed to save workout data.");
    }
}

async function initWorkoutPage() {
    await loadWorkoutData();
    generateWorkouts();
    generateWorkoutSchedule();

    document.querySelectorAll(".workout-select").forEach(select => {

    const day = select.dataset.day;

    if (workoutSchedule[day] !== undefined) {
        select.value = workoutSchedule[day];
    }
});

    document.querySelectorAll(".workout-select").forEach(select => {

        select.addEventListener("change", async () => {

            const day = select.dataset.day;

            workoutSchedule[day] = select.value;

            await saveWorkoutData();
        });
    });

}

async function startWorkoutPage() {

    const loggedIn = await requireLogin();

    if (!loggedIn) return;

    await initWorkoutPage();
}

startWorkoutPage();