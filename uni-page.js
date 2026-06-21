const grades = [
  { year: 1, grade: 50, weight: 0},
  { year: 2, grade: 60, weight: 20},
  { year: 3, grade: 68.45, weight: 40},
  { year: 4, grade: null, weight: 40}
];

import { modules } from "./modules.js";

const elements = {
    gradeContainer: document.querySelector("#grade-table-container"),
    courseContainer: document.querySelector("#course-grade-container"),
    yearContainer: document.querySelector("#year-grade-container"),
    timetableContainer: document.querySelector("#timetable"),
    moduleContainer: document.querySelector("#module-container"),
    slidersContainer: document.querySelector("#year4-sliders"),
    targetsContainer: document.querySelector("#y4-targets-container"),
    deadlinesContainer: document.querySelector("#approaching-deadlines-container")
};

function updateProgressStats() {
    
    grades[3].grade = getYear4Total().toFixed(2);
    const year4 = grades[3].grade
    const total = grades.reduce(
        (sum, y) => sum + (y.grade * y.weight/100),
        0
    );
    elements.gradeContainer.innerHTML = `
        <table>
            <tr>
                ${grades.map(y => `<th>Year ${y.year}</th>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Grade: ${y.grade}%</td>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Weight: ${y.weight}%</td>`).join("")}
            </tr>
            <tr>
                ${grades.map(y => `<td>Contribution: ${(y.grade * y.weight/100).toFixed(1)}%</td>`).join("")}
            </tr>
        </table>
        <div class="progress wrapper">
            <span>Course Total:${total.toFixed(1)}%</span>
            <progress value="${total}" max="100" class="course-progress"></progress>
        </div>
        <div>
            <span>Year Total:${year4}%</span>
            <progress value="${year4}" max="100" class="course-progress"></progress>
        
        </div>
    `;
}

function getLecturesForDay(day) {
    return modules.flatMap(module =>
        module.lectureDays
            .filter(l => l.day === day)
            .map(l => ({
                module: module.name,
                start: l.start,
                end: l.end
            }))
    )
    .sort((a, b) => a.start.localeCompare(b.start));
    
}

function generateTimetable() {

    elements.timetableContainer.innerHTML = `
        <table class="uni-timetable">
            <tr>
                ${weekdays.map(day => `<th>${day}</th>`).join("")}
            </tr>
            <tr>
                ${weekdays.map(day => `
                    <td class="uni-timetable">
                        ${
                        getLecturesForDay(day)
                        .map(l => `${l.module}<br>${l.start}-${l.end}`)
                        .join("<hr>")
                        }
                    </td>
                `).join("")}
            </tr>
        </table>
    `;
}

function renderYear4Sliders() {
    elements.slidersContainer.innerHTML = modules.map((mod, mIndex) => `
        <div class="card">
            <h3>${mod.name}</h3>

            <div class="slider-group">
                ${mod.components
                    .map((c, cIndex) => ({ c, cIndex }))
                    .filter(({ c }) => !c.completed)
                    .map(({ c, cIndex }) => `
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

function getComponentMark(component) {
    return component.completed
        ? (component.achieved ?? 0)
        : component.value;
}

function getModuleGrade(module, actualOnly = false) {
    return module.components.reduce((sum, c) => {
        if (actualOnly && !c.completed) return sum;

        const mark = c.completed
            ? (c.achieved ?? 0)
            : c.value;

        return sum + mark * c.weight / 100;
    }, 0);
}

function getYear4Total() {

    return modules.reduce((yearTotal, mod) => {

        const moduleScore = getModuleGrade(mod);
        const weightedModule = moduleScore * (mod.weight );
        
        return yearTotal + weightedModule;

    }, 0);
}

function generateModuleDescription() {
    elements.moduleContainer.innerHTML = 
    modules.map((module, mIndex) => {
        const actualGrade = getModuleGrade(module, true);
        const completedWeight = module.components.reduce( (sum, c) => sum + (c.completed ? c.weight : 0), 0);

        const rows = module.components.map((component, cIndex) => {
        
            const dueDate = new Date(component.due);
            const daysRemaining = ((dueDate - new Date()) / (1000 * 60 * 60 * 24)) + 1;
            const dueClass = daysRemaining < 5 ? "urgent" : daysRemaining < 14 ? "close" : "safe";
            return `
                <tr>
                    <td style="width: 35%;">
                    <label>
                        <input
                            type="checkbox"
                            class="assignment-complete"
                            data-module="${mIndex}"
                            data-component="${cIndex}"
                            ${component.completed ? "checked" : ""}
                        >${component.name}</label>
                        </td>
                    <td style="width: 5%;">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value="${component.achieved ?? ""}"
                            class="achieved"
                            data-module="${mIndex}"
                            data-component="${cIndex}"
                        />
                    </td>
                    <td style="width: 5%; text-align: center">${component.weight}%</td>
                    <td style="width: 50%; text-align: right;">Due:
                        <input
                            type="date"
                            value="${component.due}"
                            class="due-date"
                            data-module="${mIndex}"
                            data-component="${cIndex}"
                        />
                        <br><span class="${dueClass}">${daysRemaining.toFixed(0)} Days Left</span>
                    </td>
                </tr>
            `;
        }).join("");

        return `
            <div class="card module-description">
                <h3>${module.name}</h3>
                <h4>${module.lecturer}</h4>
                <p>
        Current Grade:
        ${actualGrade.toFixed(1)}%
    </p>

    <p>
        Completed:
        ${completedWeight}%
    </p>
                <textarea></textarea>
                <p>Days: ${module.lectureDays[0].day}, ${module.lectureDays[1].day}</p>
                <h3 style="text-align: left">Assignments:</h3>
                <table class="module-assignment-table">
                    ${rows}
                </table>
            </div>
        `;
    }).join("");
}

function getYear4ScenarioGrade(remainingMark) {

    return modules.reduce((yearTotal, mod) => {

        const moduleScore = mod.components.reduce((sum, c) => {

            const mark =
                c.completed
                    ? c.achieved
                    : remainingMark;

            return sum + (mark * c.weight/100);

        }, 0);
        return yearTotal + moduleScore * (mod.weight);

    }, 0);

}

function getCourseScenarioGrade(mark) {

    const year4 = getYear4ScenarioGrade(mark);

    return (
        grades[1].grade * grades[1].weight/100 +
        grades[2].grade * grades[2].weight/100 +
        year4 * grades[3].weight/100
    );

}

function generateY4Targets() {
    
    const worst = getCourseScenarioGrade(40);
    const best = getCourseScenarioGrade(100);


    const y2Tot = grades[1].grade*grades[1].weight / 100
    const y3Tot = grades[2].grade*grades[2].weight / 100
    const total = y2Tot + y3Tot

    elements.targetsContainer.innerHTML = `
        <table class="targets-table" style="color: black">
            <tr>
                <td style="font-weight: 700; border-bottom: 1px solid;">Current:</td>
                <td style="text-align: right; border-bottom: 1px solid;">${total.toFixed(2)}%</td>
            </tr>
            <tr>
                <td style="font-weight: 700; border-bottom: 1px solid;">Best Case:</td>
                <td style="text-align: right; border-bottom: 1px solid;">${best.toFixed(2)}%</td>
            </tr>
            <tr>
                <td style="font-weight: 700; border-bottom: 1px solid;">Worst Case:</td>
                <td style="text-align: right; border-bottom: 1px solid;">${worst.toFixed(2)}%</td>
            </tr>
        </table>
        <table class="targets-table">
            
            ${[70, 60, 50, 40] .map(target => `
                <tr>
                    <td>${target}%</td>
                    <td>Requires:</td>
                    <td>${((target - total) / 0.4).toFixed(2)}%</td>
                </tr>
            `)
            .join("")}
        </table>
    `;
}

function renderDeadlineList(deadlines) {
    return deadlines.map(d => `
        <div>
            <strong>${d.component}</strong>:
            ${Math.ceil(d.daysRemaining)} days
        </div>
    `).join("");
}

function generateDeadlines() {

    const thisWeek = [];
    const nextWeek = [];

    const today = new Date();

    // Monday of current week
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Sunday of current week
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
    endOfThisWeek.setHours(23, 59, 59, 999);

    // Monday of next week
    const startOfNextWeek = new Date(endOfThisWeek);
    startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);
    startOfNextWeek.setHours(0, 0, 0, 0);

    // Sunday of next week
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    for (const module of modules) {
        for (const component of module.components) {

            if (!component.due) continue;

            const dueDate = new Date(component.due);

            const daysRemaining = (dueDate - today) / (1000 * 60 * 60 * 24);

            const deadline = {
                module: module.name,
                component: component.name,
                due: component.due,
                daysRemaining
            };

            if (dueDate >= startOfThisWeek && dueDate <= endOfThisWeek) {
                thisWeek.push(deadline);
            }
            else if (dueDate >= startOfNextWeek && dueDate <= endOfNextWeek) {
                nextWeek.push(deadline);
            }
        }
    }

    thisWeek.sort((a, b) => new Date(a.due) - new Date(b.due));
    nextWeek.sort((a, b) => new Date(a.due) - new Date(b.due));

    elements.deadlinesContainer.innerHTML = `
        <div class="card deadlineWeek">
            <h3>Due This Week</h3>
            ${renderDeadlineList(thisWeek)}
        </div>

        <div class="card deadlineWeek">
            <h3>Due Next Week</h3>
            ${renderDeadlineList(nextWeek)}
        </div>
    `;
}

document.addEventListener("input", (e) => {
    if (e.target.classList.contains("year4-slider")) {

        const m = Number(e.target.dataset.m);
        const c = Number(e.target.dataset.c);

        const value = Number(e.target.value);

        modules[m].components[c].value = value;

        document.getElementById(`m${m}-c${c}`).textContent = value;

        refreshGrades();
    }
});

document.addEventListener("change", e => {

    const m = Number(e.target.dataset.module);
    const c = Number(e.target.dataset.component);

    if(e.target.classList.contains("assignment-complete")) {
        modules[m].components[c].completed = e.target.checked;
    }

    if(e.target.classList.contains("achieved")) {
        modules[m].components[c].achieved = Number(e.target.value);
    }

    if (e.target.classList.contains("due-date")) {
        modules[m].components[c].due = e.target.value;
    }

    generateDeadlines();
    refreshGrades();
    generateModuleDescription();
    renderYear4Sliders();
});

function saveState() {
    localStorage.setItem(
        "uniTracker",
        JSON.stringify({
            modules
        })
    );
}

function loadState() {
    const saved = localStorage.getItem("uniTracker");

    if (!saved) return;

    const state = JSON.parse(saved);

    // Restore modules
    modules.forEach((module, mIndex) => {
        module.components.forEach((component, cIndex) => {
            Object.assign(
                component,
                state.modules[mIndex].components[cIndex]
            );
        });
    });
}

function refreshGrades() {
    updateProgressStats();
    generateY4Targets();
    saveState();
}

function updateUniPage() {
    refreshGrades();
    generateTimetable();
    generateDeadlines();
    renderYear4Sliders();
    generateModuleDescription();
}

loadState()
updateUniPage()