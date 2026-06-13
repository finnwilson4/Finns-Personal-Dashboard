const grades = [
  { year: 1, grade: 50, weight: 0},
  { year: 2, grade: 60, weight: 20},
  { year: 3, grade: 68.45, weight: 40},
  { year: 4, grade: null, weight: 40}
];

const modules = [
        {
            name: "Gravity 4002",
            weight: 10/120,
            lectureDays: [
                {day: "Monday", time: "9-10am"},
                {day: "Thursday", time: "1-2pm"}
            ],
            components: [
                { name: "Coursework", value: 50, weight: 34 },
                { name: "Exam 1", value: 50, weight: 33 },
                { name: "Exam 2", value: 50, weight: 33 }
            ]
        },
        {
            name: "Imaging and Data Processing 4019",
            weight: 20/120,
            lectureDays: [
                {day: "Tuesday", time: "9-10am"},
                {day: "Friday", time: "1-2pm"}
            ],
            components: [
                { name: "Coursework", value: 50, weight: 34 },
                { name: "Exam 1", value: 50, weight: 33 },
                { name: "Exam 2", value: 50, weight: 33 }
            ]
        },
        {
            name: "Astro Research Techs in  4020",
            weight: 20/120,
            lectureDays: [
                {day: "Wednesday", time: "9-10am"},
                {day: "Monday", time: "1-2pm"}
            ],
            components: [
                { name: "Coursework", value: 50, weight: 34 },
                { name: "Exam 1", value: 50, weight: 33 },
                { name: "Exam 2", value: 50, weight: 33 }
            ]
        },
        {
            name: "Modern Cosmology 4016",
            weight: 20/120,
            lectureDays: [
                {day: "Friday", time: "9-10am"},
                {day: "Wednesday", time: "1-2pm"}
            ],
            components: [
                { name: "Coursework", value: 50, weight: 34 },
                { name: "Exam 1", value: 50, weight: 33 },
                { name: "Exam 2", value: 50, weight: 33 }
            ]
        },
        {
            name: "Project",
            weight: 50/120,
            lectureDays: [
                {day: "Thursday", time: "9-10am"},
                {day: "Tuesday", time: "1-2pm"}
            ],
            components: [
                { name: "Coursework", value: 50, weight: 34 },
                { name: "Exam 1", value: 50, weight: 33 },
                { name: "Exam 2", value: 50, weight: 33 }
            ]
        },
]


function calcContribution(grades) {
    return grades.grade * grades.weight / 100
}

function updateGradeTable() {
    const gradeContainer = document.querySelector("#grade-table-container");
    grades[3].grade = getYear4Total().toFixed(2);
    gradeContainer.innerHTML = `
        <table>
            <tr>
                ${grades.map(y => `<th>Year ${y.year}</th>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Grade: ${y.grade ?? "-"}%</td>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Weight: ${y.weight}%</td>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Contribution: ${calcContribution(y).toFixed(1)}%</td>`).join("")}
            </tr>
        </table>
    `;
}

function updateCourseProgress() {
    const courseContainer = document.querySelector("#course-grade-container");

    grades[3].grade = getYear4Total()
    const total = grades.reduce(
        (sum, y) => sum + calcContribution(y),
        0
    );
    courseContainer.innerHTML = `
        <div class="progress wrapper">
            <span>Course Total:${total.toFixed(1)}%</span>
            <progress value="${total}" max="100" class="course-progress"></progress>
        </div>
    `;
}

function updateYearProgress() {
    const yearContainer = document.querySelector("#year-grade-container");

    const total = getYear4Total()

    yearContainer.innerHTML = `
        <div>
            <span>Year Total:${total.toFixed(2)}%</span>
            <progress value="${total}" max="100" class="course-progress"></progress>
        
        </div>
    `;
}

function getLecturesForDay(day) {
    return modules.flatMap(module =>
        module.lectureDays
            .filter(l => l.day === day)
            .map(l => ({
                module: module.name,
                time: l.time
            }))
    );
}

function generateTimetable() {
    const container = document.querySelector("#timetable");

    container.innerHTML = `
        <table class="uni-timetable">
            <tr>
                ${weekdays.map(day => `<th>${day}</th>`).join("")}
            </tr>
            <tr>
                ${weekdays.map(day => `
                    <td>
                        ${
                        getLecturesForDay(day)
                        .map(l => `${l.module}<br>${l.time}`)
                        .join("<hr>")
                        }
                    </td>
                `).join("")}
            </tr>
        </table>
    `;
}

function renderYear4Sliders() {
    const container = document.querySelector("#year4-sliders");

    container.innerHTML = modules.map((mod, mIndex) => `
        <div class="card sliders">
            <h3>${mod.name}</h3>

            <div class="slider-group">
                ${mod.components.map((c, cIndex) => `
                    <div class="slider-row">
                        <label>
                            ${c.name}: 
                            <span id="m${mIndex}-c${cIndex}">${c.value}</span>%
                        </label>

                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value="${c.value}"
                            data-m="${mIndex}"
                            data-c="${cIndex}"
                            class="year4-slider"
                        />
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}

function getYear4Total() {

    return modules.reduce((yearTotal, mod) => {

        // 1. calculate weighted module score (normalised to 100)
        const moduleScore = mod.components.reduce((sum, c) => {
            return sum + (c.value * c.weight);
        }, 0);
        
        // 2. apply module weight
        const weightedModule = moduleScore * (mod.weight / 100);
        
        return yearTotal + weightedModule;

    }, 0);
}

document.addEventListener("input", (e) => {
    if (e.target.classList.contains("year4-slider")) {

        const m = Number(e.target.dataset.m);
        const c = Number(e.target.dataset.c);

        const value = Number(e.target.value);

        modules[m].components[c].value = value;

        document.getElementById(`m${m}-c${c}`).textContent = value;

        updateCourseProgress()
        updateYearProgress();
    }
});

function updateUniPage() {
    updateGradeTable();
    updateCourseProgress();
    updateYearProgress();
    generateTimetable();
    renderYear4Sliders();
}

updateUniPage()