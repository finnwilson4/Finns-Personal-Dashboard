export const modules = [
        {
            name: "Gravity 4002",
            lecturer: "Paul Saffin",
            weight: 10/120,
            lectureDays: [
                {day: "Monday", start: "09:00", end:"10:00"},
                {day: "Thursday", start:"13:00", end:"14:00"}
            ],
            components: [
                { name: "Grav.Coursework", due: "2026-07-24", value: 50, weight: 25, completed: false, achieved: null },
                { name: "Grav.Exam 1", due: "2026-06-22", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Grav.Exam 2", due: "2026-06-26", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Grav.Exam 3", due: "2026-06-26", value: 50, weight: 25, completed: false, achieved: null},
            ]
        },
        {
            name: "Imaging / Data Processing 4019",
            lecturer: "Name Here",
            weight: 20/120,
            lectureDays: [
                {day: "Tuesday", start: "09:00", end:"10:00"},
                {day: "Friday", start:"13:00", end:"14:00"}
            ],
            components: [
                { name: "I+DP.Coursework", due: "2026-06-18", value: 50, weight: 25, completed: false, achieved: null},
                { name: "I+DP.Exam 1", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "I+DP.Exam 2", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "I+DP.Exam 3", due: "2026-06-26", value: 50, weight: 25, completed: false, achieved: null},
            ]
        },
        {
            name: "Astro Research Techs in  4020",
            lecturer: "Name Here",
            weight: 20/120,
            lectureDays: [
                {day: "Wednesday", start: "09:00", end:"10:00"},
                {day: "Monday", start:"13:00", end:"14:00"}
            ],
            components: [
                { name: "Astro.Coursework", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Astro.Exam 1", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Astro.Exam 2", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Astro.Exam 3", due: "2026-06-26", value: 50, weight: 25, completed: false, achieved: null},
            ]
        },
        {
            name: "Modern Cosmology 4016",
            lecturer: "Name Here",
            weight: 20/120,
            lectureDays: [
                {day: "Friday", start: "09:00", end:"10:00"},
                {day: "Wednesday", start:"13:00", end:"14:00"}
            ],
            components: [
                { name: "Cosmo.Coursework", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Cosmo.Exam 1", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Cosmo.Exam 2", due: "2026-09-01", value: 50, weight: 25, completed: false, achieved: null},
                { name: "Cosmo.Exam 3", due: "2026-06-26", value: 50, weight: 25, completed: false, achieved: null},
            ]
        },
        {
            name: "Project",
            lecturer: "Name Here",
            weight: 50/120,
            lectureDays: [
                {day: "Thursday", start: "09:00", end:"10:00"},
                {day: "Tuesday", start:"13:00", end:"14:00"}
            ],
            components: [
                { name: "Lit Review", due: "2026-09-01", value: 50, weight: 10, completed: false, achieved: null},
                { name: "Viva", due: "2026-09-01", value: 50, weight: 40, completed: false, achieved: null},
                { name: "Diss", due: "2026-09-01", value: 50, weight: 50, completed: false, achieved: null},
                
            ]
        },
]