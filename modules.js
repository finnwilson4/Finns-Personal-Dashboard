export const modules = [
        {
            name: "Gravity 4002",
            lecturer: "Paul Saffin",
            weight: 10/120,
            lectureDays: [
                {day: "Monday", start: "11:00", end:"12:00"},
                {day: "Monday", start:"12:00", end:"13:00"}
            ],
            components: [
                { name: "Grav.Coursework", due: "2026-07-24", value: 50, weight: 100, completed: false, achieved: null },
            ]
        },
        {
            name: "Imaging / Data Processing 4019",
            lecturer: "Name Here",
            weight: 20/120,
            lectureDays: [
                {day: "Tuesday", start: "10:00", end:"12:00"},
                {day: "Tuesday", start:"14:00", end:"16:00"},
                {day: "Thursday", start:"10:00", end:"12:00"}
            ],
            components: [
                { name: "I+DP. Project", due: "2026-06-18", value: 50, weight: 40, completed: false, achieved: null},
                { name: "I+DP. Presentation", due: "2026-09-01", value: 50, weight: 30, completed: false, achieved: null},
                { name: "I+DP. Problem Sheets", due: "2026-09-01", value: 50, weight: 30, completed: false, achieved: null},
                
            ]
        },
        {
            name: "Astro Research Techs  4020",
            lecturer: "Omar Almaini",
            weight: 20/120,
            lectureDays: [
                {day: "", start: "", end:""},
                {day: "", start: "", end:""}
            ],
            components: [
                { name: "Astro. Coursework 1", due: "2026-09-01", value: 50, weight: 35, completed: false, achieved: null},
                { name: "Concept Proposal", due: "2026-09-01", value: 50, weight: 5, completed: false, achieved: null},
                { name: "Full Proposal", due: "2026-09-01", value: 50, weight: 40, completed: false, achieved: null},
                { name: "Astro. Coursework 2", due: "2026-06-26", value: 50, weight: 10, completed: false, achieved: null},
                { name: "Astro. Presentation", due: "2026-06-26", value: 50, weight: 10, completed: false, achieved: null},
            ]
        },
        {
            name: "Modern Cosmology 4016",
            lecturer: "Name Here",
            weight: 20/120,
            lectureDays: [
                {day: "", start: "", end:""},
                {day: "", start: "", end:""}
            ],
            components: [
                { name: "Cosmo. Coursework", due: "2026-09-01", value: 50, weight: 50, completed: false, achieved: null},
                { name: "Cosmo. Project", due: "2026-09-01", value: 50, weight: 50, completed: false, achieved: null},
            ]
        },
        {
            name: "Project",
            lecturer: "Name Here",
            weight: 50/120,
            lectureDays: [
                {day: "", start: "", end:""},
                {day: "", start: "", end:""}
            ],
            components: [
                { name: "Lit Review", due: "2026-09-01", value: 50, weight: 10, completed: false, achieved: null},
                { name: "Viva", due: "2026-09-01", value: 50, weight: 40, completed: false, achieved: null},
                { name: "Project Report", due: "2026-09-01", value: 50, weight: 50, completed: false, achieved: null},
                
            ]
        },
]
