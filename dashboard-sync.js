// ==========================================
// DASHBOARD DATA SYNCHRONISATION
// ==========================================

let dashboardData = {
    ingredients: null,
    financeState: null
};


// ------------------------------------------
// LOAD DATA FROM SUPABASE
// ------------------------------------------

async function initialiseDashboardData() {

    console.log("Loading dashboard data...");

    const savedData = await loadDashboardData();

    if (savedData) {

        console.log("Saved dashboard data found.");

        // Load saved ingredients
        if (savedData.ingredients) {
            Object.assign(ingredients, savedData.ingredients);
        }

        // Load saved finance state
        if (savedData.financeState) {
            Object.assign(financeState, savedData.financeState);

            // Convert saved dates back into Date objects
            if (financeState.oneOffExpenses) {
                financeState.oneOffExpenses =
                    financeState.oneOffExpenses.map(expense => ({
                        ...expense,
                        date: new Date(expense.date)
                    }));
            }
        }

    } else {

        console.log("No saved dashboard data found.");
        console.log("Using default dashboard data.");
    }

    dashboardData.ingredients = ingredients;
    dashboardData.financeState = financeState;

    return dashboardData;
}


// ------------------------------------------
// SAVE DATA TO SUPABASE
// ------------------------------------------

async function saveCurrentDashboardData() {

    const dataToSave = {
        ingredients: ingredients,
        financeState: financeState
    };

    const success = await saveDashboardData(dataToSave);

    if (success) {
        console.log("Dashboard data saved.");
    } else {
        console.error("Failed to save dashboard data.");
    }

    return success;
}