// Containers
const mealsContainer = document.getElementById("meal-container");
const mealPlanContainer = document.getElementById("meal-plan-container");
const ingredientsContainer = document.getElementById("ingredients-container");
const missingIngredientsContainer = document.getElementById("missing-ingredients-container")

// Meal Information
let schedule = {};
const categories = ["Fridge", "Freezer", "Cupboard"];
let ingredientStock = {};

async function loadMealPlannerData() {
    const savedData = await loadDashboardData();

    if (savedData) {
        schedule = savedData.mealSchedule || {};
        ingredientStock = savedData.ingredientStock || {};
    }

    console.log("Meal planner data loaded from Supabase.");
}

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

            totalCost += (
                (ingredient.price * quantity / ingredient.number)
                / meal.portions
            );

            rows += `
                <tr>
                    <td style="width: 40%">${ingredient.name}</td>
                    <td style="width: 40%">x${quantity}</td>
                    <td style="width: 40%">
                        £${(ingredient.price * quantity / ingredient.number).toFixed(2)}
                    </td>
                </tr>
            `;
        }

        const isQuickMeal = Object.keys(meal.ingredients).length < 3;

        if (isQuickMeal) {

            // Quick meals stay exactly as they were before
            mealsContainer.innerHTML += `
                <div class="card meal">
                    <h2>${meal.name}</h2>
                    <p>Quick Meal</p>
                    <h3>Total Cost (per portion): £${totalCost.toFixed(2)}</h3>
                </div>
            `;

        } else {

            // Normal meals have collapsible ingredients
            mealsContainer.innerHTML += `
                <div class="card meal">
                    <h2>${meal.name}</h2>

                    <button class="toggle-ingredients">
                        Show Ingredients
                    </button>

                    <div class="meal-ingredients" style="display: none;">
                        <table class="meal-description-table">
                            ${rows}
                        </table>
                    </div>

                    <h3>Portions: ${meal.portions}</h3>
                    <h3>Total Cost (per portion): £${totalCost.toFixed(2)}</h3>
                </div>
            `;
        }
    }

    // Add Show/Hide functionality
    document.querySelectorAll(".toggle-ingredients").forEach(button => {

        button.addEventListener("click", () => {

            const ingredientsSection = button.nextElementSibling;

            if (ingredientsSection.style.display === "none") {

                ingredientsSection.style.display = "block";
                button.textContent = "Hide Ingredients";

            } else {

                ingredientsSection.style.display = "none";
                button.textContent = "Show Ingredients";
            }
        });
    });
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
    const shoppingList = calculateRequiredIngredients();
    let totalCost = 0;

    // Calculate total cost
    for (const [ingredientKey, quantity]
        of Object.entries(shoppingList)) {

        const ingredient = ingredients[ingredientKey];

        if (!ingredient) continue;

        const packsNeeded = Math.ceil(quantity / ingredient.number);

        totalCost += packsNeeded * ingredient.price;
    }

    ingredientsContainer.innerHTML += `
        <h3 class="ingredient-total-cost" style="margin: 0px">Cost: £${totalCost.toFixed(2)}</h3>
    `;

    categories.forEach(category => {

        let rows = "";

        for (const [key, ingredient] of Object.entries(ingredients)) {

            if (ingredient.category !== category) continue;

            const quantity = shoppingList[key] || 0;

            const packsNeeded = quantity > 0
                ? Math.ceil(quantity / ingredient.number)
                : 0;

            const missingDisplay = quantity > 0
                    ? `x${packsNeeded} (x${quantity})`
                    : "";

            const rowClass = quantity > 0
                    ? "ingredient-row ingredient-missing"
                    : "ingredient-row";

            rows += `
                <div class="ingredient-row">
                    <label>${ingredient.name}</label>
                    <input type="number" class="ingredient-input" data-key="${key}">
                    <span
                        class="ingredient-need"
                        data-key="${key}"
                    >${missingDisplay}</span>
                </div>
            `;
        }

        ingredientsContainer.innerHTML += `
            <div class="card ingredient-category">
                <h2>${category}</h2>
                <div class="ingredient-header">
                    <span></span>
                    <span>Have</span>
                    <span>Need</span>
                </div>
                ${rows}
            </div>
        `;
    });
}

function updateIngredientNeeds() {

    const shoppingList = calculateRequiredIngredients();
    let totalCost = 0;

    document.querySelectorAll(".ingredient-need").forEach(needElement => {

        const key = needElement.dataset.key;
        const quantity = shoppingList[key] || 0;

        if (quantity > 0) {

            const ingredient = ingredients[key];
            const packsNeeded = Math.ceil(quantity / ingredient.number);
            
            totalCost += packsNeeded * ingredient.price;
            needElement.textContent = `x${packsNeeded} (x${quantity})`;

        } else {

            needElement.textContent = "";
        }
    });
    const totalCostElement =
        document.querySelector(".ingredient-total-cost");

    totalCostElement.textContent =
        `Cost: £${totalCost.toFixed(2)}`;
}

function calculateRequiredIngredients() {

    const mealCounts = {};

    // Count how many times each meal appears
    Object.values(schedule).forEach(mealKey => {

        if (!mealKey) return;

        mealCounts[mealKey] =
            (mealCounts[mealKey] || 0) + 1;
    });

    // Calculate total ingredients required
    const ingredientsNeeded = {};

    for (const [mealKey, count] of Object.entries(mealCounts)) {

        const meal = meals[mealKey];

        if (!meal) continue;

        const cooksNeeded = Math.ceil(count / meal.portions);

        for (const [ingredientKey, quantity]
            of Object.entries(meal.ingredients)) {

            ingredientsNeeded[ingredientKey] =
                (ingredientsNeeded[ingredientKey] || 0)
                + (quantity * cooksNeeded);
        }
    }

    // Compare required ingredients with stock
    const shoppingList = {};

    for (const [ingredientKey, required]
        of Object.entries(ingredientsNeeded)) {

        const owned = Number(ingredientStock[ingredientKey]) || 0;

        if (owned < required) {
            shoppingList[ingredientKey] = required - owned;
        }
    }

    return shoppingList;
}

// Save Selected Options
function updateMealPlan() {

    document.querySelectorAll(".meal-plan-select").forEach(select => {

        select.addEventListener("change", () => {

            const day = select.dataset.day;

            schedule[day] = select.value;

            saveMealPlannerData();

            updateIngredientNeeds();
        });
    });
}

async function saveMealPlannerData() {

    const savedData = await loadDashboardData() || {};

    savedData.mealSchedule = schedule;
    savedData.ingredientStock = ingredientStock;

    const success = await saveDashboardData(savedData);

    if (!success) {
        console.error("Failed to save meal planner data.");
    }
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

            saveMealPlannerData();

            updateIngredientNeeds();
        });
    });
}

async function initPage() {

    await loadMealPlannerData();

    renderMeals();
    renderMealPlan();
    renderIngredients();

    updateInputs();
    loadSelectedOptions();
    updateMealPlan();

    updateIngredientNeeds();
}

initPage();