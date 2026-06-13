const container = document.getElementById("workout-container");
const scheduleContainer = document.getElementById("schedule-container");

// Populate Workout Types
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
let workoutOptions = `
    <option value="">Rest Day</option>
`;

for (const [key, workout] of Object.entries(workouts)) {
    workoutOptions += `
        <option value="${key}">
            ${workout.name}
        </option>
    `;
}

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

// Save Selected Options
document.querySelectorAll(".workout-select").forEach(select => {
    select.addEventListener("change", () => {
        const day = select.dataset.day;

        localStorage.setItem(
            `workout-${day}`,
            select.value
        );
    });
});
document.querySelectorAll(".workout-select").forEach(select => {
    const day = select.dataset.day;
    const savedWorkout = localStorage.getItem(
        `workout-${day}`
    );

    if (savedWorkout !== null) {
        select.value = savedWorkout;
    }
});
