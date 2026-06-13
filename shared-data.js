const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const weekdays = days.slice(0, 5);

const workouts = {
    arms: {
        name: "Arms",
        exercises: [
            {
                name: "Bicep Curls",
                weight: "8kg",
                muscle: "Bicep"
            },
            {
                name: "Hammer Curls",
                weight: "8kg",
                muscle: "Brachialis"
            },
            {
                name: "Forearm Curls",
                weight: "6kg",
                muscle: "Brachio Radialis"
            },
            {
                name: "Finger Curls",
                weight: "6kg",
                muscle: "Inner Forearm"
            },
            {
                name: "Tricep Curls",
                weight: "8kg",
                muscle: "Tricep Longhead"
            },
            {
                name: "Tricep Extensions",
                weight: "6kg",
                muscle: "Tricep Shorthead"
            }
        ]
    },

    legs: {
        name: "Legs",
        exercises: [
            {
                name: "Goblet Squats",
                weight: "8kg",
                muscle: "Quads"
            },
            {
                name: "Dumbbell Lowers",
                weight: "8kg",
                muscle: "Hamstrings"
            },
            {
                name: "Bulgarian Squats",
                weight: "8kg",
                muscle: "Glutes"
            },
            {
                name: "Wide Squats",
                weight: "8kg",
                muscle: "Adductors"
            },
            {
                name: "Calf Raises",
                weight: "8kg",
                muscle: "Calves"
            }
        ]
    },

    back: {
        name: "Back",
        exercises: [
            {
                name: "Bent-Over Rows (In)",
                weight: "8kg",
                muscle: "Mid Back"
            },
            {
                name: "Knelt-Over Raises",
                weight: "8kg",
                muscle: "Lats"
            },
            {
                name: "Shoulder Extensions",
                weight: "8kg",
                muscle: "Rear Delts"
            },
            {
                name: "Bent-Over Rows (Out)",
                weight: "8kg",
                muscle: "Upper Back"
            },
            {
                name: "Shoulder Shrugs",
                weight: "8kg",
                muscle: "Upper Traps"
            }
        ]
    },

    chestShoulders: {
        name: "Chest/Shoulders",
        exercises: [
            {
                name: "Arm Raises",
                weight: "8kg",
                muscle: "Front Delts"
            },
            {
                name: "Lateral Raises",
                weight: "8kg",
                muscle: "Lateral Delts"
            },
            {
                name: "Shoulder Extensions",
                weight: "8kg",
                muscle: "Rear Delts"
            },
            {
                name: "Downward Press",
                weight: "8kg",
                muscle: "Lower Chest"
            },
            {
                name: "Flat Press",
                weight: "8kg",
                muscle: "Lower Chest"
            },
            {
                name: "Cross Body Raises",
                weight: "6kg",
                muscle: "Upper Chest"
            },
            {
                name: "Chest Flies",
                weight: "6kg",
                muscle: "Mid Chest"
            }
        ]
    }
};

const ingredients = {
    // when price is divided, means item in store contains more than one portion
    // some things (mince) contain >1 portion, but are not divided as they are used in full in each meal, then the meal sorts out portions 

    // Fridge
    onion: {
        name: "Onion",
        number: 3,
        category: "Fridge",
        price: 0.95
    },

    pepper: {
        name: "Pepper",
        number: 3,
        category: "Fridge",
        price: 1.20
    },

    carrot: {
        name: "Carrot",
        number: 3,
        category: "Fridge",
        price: 0.8,
    },

    mushroom: {
        name: "Mushrooms",
        number: 2,
        category: "Fridge",
        price: 1.29, // Tesco
    },

    peas: {
        name: "Peas",
        number: 6,
        category: "Freezer",
        price: 1.50,
    },

    chicken: {
        name: "Chicken Breast",
        number: 2,
        category: "Fridge",
        price: 2.50,
    },

    sausages: {
        name: "Sausages",
        number: 8,
        category: "Fridge",
        price: 1.40
    },

    mince: {
        name: "Mince",
        number: 1,
        category: "Fridge",
        price: 2.5,
    },

    halloumi: {
        name: "Halloumi",
        number: 1,
        category: "Fridge",
        price: 1.99, // Tesco
    },

    mozzerella: {
        name: "Mozzerella",
        number: 1,
        category: "Fridge",
        price: 0.70,
    },

    feta: {
        name: "Feta",
        number: 1,
        category: "Fridge",
        price: 1.25,
    },

    doubleCream: {
        name: "Double Cream",
        number: 1,
        category: "Fridge",
        price: 1.5,
    },

    // Cupboard
    blackBeans: {
        name: "Black Beans",
        number: 1,
        category: "Cupboard",
        price: 0.46,
    },

    kidneyBeans: {
        name: "Kidney Beans",
        number: 1,
        category: "Cupboard",
        price: 0.39,
    },

    bakedBeans: {
        name: "Baked Beans",
        number: 1,
        category: "Cupboard",
        price: 0.46,
    },

    chickpeas: {
        name: "Chickpeas",
        number: 1,
        category: "Cupboard",
        price: 0.60,
    },

    tinnedTom: {
        name: "Tinned Toms",
        number: 1,
        category: "Cupboard",
        price: 0.90,
    },

    rice: {
        name: "Rice",
        number: 1,
        category: "Cupboard",
        price: 0.85,
    },

    pasta: {
        name: "Pasta",
        number: 3,
        category: "Cupboard",
        price: 0.41,
    },

    potato: {
        name: "Potato",
        number: 1,
        category: "Cupboard",
        price: 0.30,
    },

    sweetPotato: {
        name: "Sweet Potato",
        number: 1,
        category: "Cupboard",
        price: 0.70,
    },

    tortilla: {
        name: "Tortillas",
        number: 8,
        category: "Cupboard",
        price: 0.90,
    },

    bread: {
        name: "Bread",
        number: 20,
        category: "Cupboard",
        price: 0.75,
    },

    pastaSauce: {
        name: "Pasta Sauce",
        number: 3,
        category: "Cupboard",
        price: 0.90,
    },

    // Freezer
    pizza: {
        name: "Pizza",
        number: 1,
        category: "Freezer",
        price: 1.10,
    },

    sweetcorn: {
        name: "Sweetcorn",
        number: 6,
        category: "Freezer",
        price: 1.50,
    },

    chips: {
        name: "Chips",
        number: 4,
        category: "Freezer",
        price: 1.20,
    },

    garlicBread: {
        name: "Garlic Bread",
        number: 2,
        category: "Freezer",
        price: 1.00,
    }
};

const meals = {
    // ingredients are omitted from meals when they are a generic/ constant (e.g pasta,, spaghetti, tomato puree)
    burritoBowl: {
        name: "Burrito Bowl",
        time: 30,
        portions: 2,

        ingredients: {
            onion: 1,
            pepper: 1,
            halloumi: 1,
            blackBeans: 1,
            kidneyBeans: 1,
            rice: 1,
        }
    },

    chickenBurritos: {
        name: "Chicken Burritos",
        time: 30,
        portions: 4,

        ingredients: {
            chicken: 2,
            onion: 1,
            pepper: 1,
            blackBeans: 1,
            kidneyBeans: 1,
            rice: 1,
            tortilla: 1,
        }
    },

    jacketPotato: {
        name: "Jacket Potato",
        time: 30,
        portions: 1,

        ingredients: {
            potato: 2,
            bakedBeans: 1,
        }
    },

    spagbol: {
        name: "Spag Bol",
        time: 30,
        simple: false,
        portions: 3,

        ingredients: {
            onion: 1,
            pepper: 1,
            carrot: 1,
            mushroom: 1,
            mince: 1,
            tinnedTom: 1,
            
        }
    },

    loadedFries: {
        name: "Loaded Fries",
        time: 30,
        portions: 2,

        ingredients: {
            onion: 1,
            pepper: 1,
            mince: 1,
            tinnedTom: 1,
            chips: 1,
        }
    },

    beansOnToast: {
        name: "Beans on Toast",
        time: 15,
        portions: 1,
        ingredients: {
            bakedBeans: 1,
            bread: 2,
        }
    },

    pasta: {
        name: "Pasta",
        time: 15,
        portions: 1,

        ingredients: {
            pasta: 1,
            pastaSauce: 1,
        }
    },

    pizza: {
        name:"Pizza",
        time: 15,
        portions: 1,
        ingredients: {
            pizza: 1
        }
    },

    creamyChickenPasta: {
        name: "Creamy Chicken Pasta",
        time: 30,
        portions: 3,
        ingredients: {
            onion: 1,
            pepper: 1,
            chicken: 2,
            pasta: 3,
            doubleCream: 1,
        }
    },

    chilli: {
        name: "Chilli and Rice",
        time: 30,
        portions: 2,
        ingredients: {
            onion: 1,
            kidneyBeans: 1,
            mince: 1,
            tinnedTom: 1,
            rice: 1,
        }
    },

    sausageAndMash: {
        name: "Sausage and Mash",
        time: 45,
        portions:1,
        ingredients: {
            potato: 3,
            sausages: 4,
            peas: 1,
            carrot: 1,
        }
    },

    sweetPotatoBake: {
        name: "Sweet Potato Bake",
        time: 45,
        portions: 2,
        ingredients: {
            onion: 1,
            sweetPotato: 2,
            chickpeas: 1,
            feta: 1,
        }
    },

    chickenGarlicBread: {
        name: "Chicken Stuffed Garic Bread",
        time: 30,
        portions: 2,
        ingredients: {
            onion: 1,
            pepper: 1,
            chicken: 2,
            doubleCream: 1,
            garlicBread: 2,
            mozzerella: 1,
        }
    },
};

