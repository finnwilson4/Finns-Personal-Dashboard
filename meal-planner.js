// DEFINE CONSTANTS

// Containers
const mealsContainer = document.getElementById("meal-container");
const mealPlanContainer = document.getElementById("meal-plan-container");
const ingredientsContainer = document.getElementById("ingredients-container");
const missingIngredientsContainer = document.getElementById("missing-ingredients-container")

// Meal Information
const schedule = JSON.parse(localStorage.getItem("mealSchedule")) || {};
const categories = ["Fridge", "Freezer", "Cupboard"];
const ingredientStock = JSON.parse(localStorage.getItem("ingredientStock")) || {};

function renderMeals() {

    mealsContainer.innerHTML = "";

    const sortedMeals = Object.values(meals).sort((a, b) => {
        const aSimple = Object.keys(a.ingredients).length < 3;
        const bSimple = Object.keys(b.ingredients).length < 3;
        return bSimple - aSimple;
    });

    for (const meal of sortedMeals) {

        let rows = "";
        let totalCost = 0;

        for (const [ingredientKey, quantity] of Object.entries(meal.ingredients)) {

            const ingredient = ingredients[ingredientKey];
            totalCost += ((ingredient.price  * quantity / ingredient.number) / meal.portions);

            rows += `
                <tr>
                    <td style="width: 40%">${ingredient.name}</td>
                    <td style="width: 40%">x${quantity}</td>
                    <td style="width: 40%">£${(ingredient.price * quantity/ingredient.number).toFixed(2)}</td>
                </tr>
            `;
        }

        mealsContainer.innerHTML += `
            <div class="card meal">
                <h2>${meal.name}</h2>
                ${Object.keys(meal.ingredients).length < 3 ? `<p>Quick Meal</p> <h3>Total Cost (per portion): £${totalCost.toFixed(2)}</h3>` : `
                    <table class="meal-description-table">${rows}</table>
                    <h3>Portions: ${meal.portions}</h3>
                    <h3>Total Cost (per portion): £${totalCost.toFixed(2)}</h3>
                `}
            </div>
        `;
    }
}

// Generate meal options
let mealOptions = `
    <option value="">N/A</option>
`;

for (const [key, meal] of Object.entries(meals)) {
    mealOptions += `
        <option value="${key}">
            ${meal.name}
        </option>
    `;
}

// Generate schedule table
function renderMealPlan() {

    let headers = "";
    let selects = "";

    
    days.forEach(day => {

        headers += `<th>${day}</th>`;

        selects += `
            <td>
                <select class="meal-plan-select" data-day="${day.toLowerCase()}">
                    ${mealOptions}
                </select>
            </td>
        `;
    });

    mealPlanContainer.innerHTML = `
        <table class="meal-plan-table">
            <tr>${headers}</tr>
            <tr>${selects}</tr>
        </table>
    `;
}

// Generate Ingredients Column
function renderIngredients() {

    ingredientsContainer.innerHTML = "";

    categories.forEach(category => {

        let rows = "";

        for (const [key, ingredient] of Object.entries(ingredients)) {

            if (ingredient.category !== category) continue;

            rows += `
                <div class="ingredient-row">
                    <label>${ingredient.name}</label>
                    <input type="number" class="ingredient-input" data-key="${key}">
                </div>
            `;
        }

        ingredientsContainer.innerHTML += `
            <div class="card ingredient-category">
                <h2>${category}</h2>
                ${rows}
            </div>
        `;
    });
}

// Generate Missing Ingredients Column
function updateRequiredIngredients() {
    
    const schedule = JSON.parse(localStorage.getItem("mealSchedule")) || {};
    const stock = JSON.parse(localStorage.getItem("ingredientStock")) || {};
    const mealCounts = {};

    // Count how many times each meal appears
    Object.values(schedule).forEach(mealKey => {

        if (!mealKey) return;

        mealCounts[mealKey] =
            (mealCounts[mealKey] || 0) + 1;
    });

    // Calculate ingredients required
    const ingredientsNeeded = {};

    for (const [mealKey, count] of Object.entries(mealCounts)) {

        const meal = meals[mealKey];

        if (!meal) continue;

        const cooksNeeded =
            Math.ceil(count / meal.portions);

        for (const [ingredientKey, quantity]
                of Object.entries(meal.ingredients)) {

            ingredientsNeeded[ingredientKey] =
                (ingredientsNeeded[ingredientKey] || 0)
                + (quantity * cooksNeeded);
        }
    }

    // Compare required vs owned
    const shoppingList = {};

    for (const [ingredientKey, required] of Object.entries(ingredientsNeeded)) {

        const owned = Number(stock[ingredientKey]) || 0;

        if (owned < required) {shoppingList[ingredientKey] = required - owned;}
    }

    // Display results
    let html = "";
    let totalCost = 0;

    for (const [ingredientKey, quantity] of Object.entries(shoppingList)) {

        const ingredient = ingredients[ingredientKey];

        if (!ingredient) continue;

        const packsNeeded = Math.ceil(quantity / ingredient.number);

        totalCost += packsNeeded * ingredient.price;
    }

    categories.forEach(category => {

        let rows = "";

        for (const [ingredientKey, quantity] of Object.entries(shoppingList)) {
            
            const ingredient = ingredients[ingredientKey];
            const packsNeeded = Math.ceil(quantity / ingredient.number);

            if (ingredient.category !== category) {
                continue;
            }

            rows += `
                <div class="ingredient-row">
                    <label>${ingredient.name}</label>
                    <label>${(packsNeeded * ingredient.price).toFixed(2)}</label>
                    <span>x${packsNeeded} (x${quantity})</span>
                </div>
            `;
        }

        if (rows !== "") {
            html += `
                <div class="card ingredient-category">
                    <h2>${category}</h2>
                    ${rows}
                    
                </div>
            `;
        }
    });

    if (html === "") {
        html = "<p>All ingredients available.</p>";
    } else {
    html = `
        <div>
            <h3>Total Cost: £${totalCost.toFixed(2)}</h3>
        </div>
        ${html}
    `;
}

    missingIngredientsContainer.innerHTML = html;
}

// Save Selected Options
function updateMealPlan() {

    document.querySelectorAll(".meal-plan-select").forEach(select => {

        select.addEventListener("change", () => {

            const day = select.dataset.day;
            const schedule = JSON.parse(localStorage.getItem("mealSchedule")) || {};

            schedule[day] = select.value;

            localStorage.setItem("mealSchedule", JSON.stringify(schedule));

            updateRequiredIngredients();
        });
    });
}

// Load Selected Options
function loadSelectedOptions() {
    document.querySelectorAll(".meal-plan-select").forEach(select => {

        const day = select.dataset.day;

        if (schedule[day] !== undefined) {
            select.value = schedule[day];
        }
    });
}

// Save Inputs
const inputs = document.querySelectorAll(".ingredient-input");

function updateInputs() {
    const inputs = document.querySelectorAll(".ingredient-input");

    inputs.forEach(input => {

        const key = input.dataset.key;

        input.value = ingredientStock[key] || "";

        input.addEventListener("input", () => {

            ingredientStock[key] = input.value;

            localStorage.setItem(
                "ingredientStock",
                JSON.stringify(ingredientStock)
            );

            updateRequiredIngredients();
        });
    });
}

function initPage() {

    renderMeals();
    renderMealPlan();
    renderIngredients();

    updateInputs();
    loadSelectedOptions();
    updateMealPlan();

    updateRequiredIngredients();
}

initPage();