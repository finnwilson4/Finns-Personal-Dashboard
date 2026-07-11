containers = {
    balanceContainer: document.querySelector("#balance-breakdown"),
    outgoingsContainer: document.querySelector("#outgoings-bar"),
    sliderContainer: document.querySelector("#expense-sliders"),
    monthTextContainer: document.querySelector("#month-text"),
    yearTextContainer: document.querySelector("#year-text"),
}

const financeDays = 365
const today = new Date();

const dates = Array.from({ length: 365 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
);

function isNonWorkingDay(date) {
    const day = date.getDay();

    return (
        day === 0 ||                 // Sunday
        day === 6 ||                 // Saturday
        isBankHoliday(date)
    );
}

function isBankHoliday(date) {
    const iso = date.toISOString().slice(0, 10);
    return BANK_HOLIDAYS.includes(iso);
}

function getPayDates(startYear, months = 12) {
    const payDates = [];

    for (let i = 0; i < months; i++) {
        let payDay = new Date(startYear, i, 25);

        while (isNonWorkingDay(payDay)) {
            payDay.setDate(payDay.getDate() - 1);
        }

        payDates.push(new Date(payDay));
    }

    return payDates;
}

const payDates = getPayDates(today.getFullYear(), 24);

function cumulative(start, changes) {
    const values = [];
    let current = start;

    for (let i = 0; i < changes.length; i++) {
        current += changes[i];
        values.push(current);
    }

    return values;
}

function sameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function simulate(financeState) {

    const startBalance = Object.values(financeState.balances)
    .reduce((sum, balance) => sum + balance, 0);
    
    const dailyChange = new Array(financeDays).fill(0);
    const changes = {};
    const monthlyTotal = Object.values(financeState.monthlyOutgoings)
        .reduce((sum, expense) => {
            return sum + Math.abs(expense.amount);
        }, 0); // Comes out as a positive number

    const monthlyFixed = monthlyTotal + (financeState.monthlyOutgoings.Food.amount + financeState.monthlyOutgoings.Other.amount)

    Object.keys(financeState.balances).forEach(account => {
        changes[account] = new Array(financeDays).fill(0);
    });
    
    for (let i = 0; i < dates.length; i++) {

        const today = dates[i];
        const isPayDay = payDates.some(payDay => sameDay(today, payDay));
        if (i < 46) {
            pay = 70*12.81;
        } else {
            pay = financeState.pay
        }
        
        // console.log("Pay:", i,":", pay)
        if (isPayDay) {
            dailyChange[i] += pay;
            changes.Bills[i] += monthlyFixed;
            changes.Spending[i] += 200;
            changes.Car[i] += 40;
            changes.Holiday[i] += 40;
            changes.Savings[i] += (pay);
            changes.Savings[i] -= (monthlyFixed + 200 + 40 + 40);
        }

        if (isPayDay && i < 50)
        {
            changes.Savings[i] -= ( - (monthlyFixed))
            changes.Bills[i] -= (monthlyFixed);
        }

        Object.values(financeState.monthlyOutgoings).forEach(outgoing => {

            if (
                outgoing.type === "monthly" &&
                today.getDate() === outgoing.day
            ) {
                dailyChange[i] += outgoing.amount;
            }

            if ((outgoing.name === "Rent" || "Spotify" || "Apple")
                && today.getDate() === outgoing.day)
            {
                changes.Bills[i] += outgoing.amount
            }

            if ((outgoing.name === "Rent" || "Spotify")
                && (i < 55)
                && today.getDate() === outgoing.day)
            {   
                changes.Bills[i] -= outgoing.amount;
                dailyChange[i] -= outgoing.amount;
            }
        });

        const dailyFood = Math.abs(financeState.monthlyOutgoings.Food.amount)*12/365;
        const dailyOther = Math.abs(financeState.monthlyOutgoings.Other.amount)*12/365;

        dailyChange[i] -= dailyFood;
        dailyChange[i] -= dailyOther;

        changes.Spending[i] -= dailyFood;
        changes.Spending[i] -= dailyOther;

        financeState.oneOffExpenses.forEach(expense => {

            if (sameDay(today, expense.date)) {
                dailyChange[i] += expense.amount;
                changes.Savings[i] += expense.amount;
            }

        });
    }

    const forecast = {
        total: cumulative(startBalance, dailyChange),

        spending: cumulative(
            financeState.balances.Spending,
            changes.Spending
        ),

        bills: cumulative(
            financeState.balances.Bills,
            changes.Bills
        ),

        savings: cumulative(
            financeState.balances.Savings,
            changes.Savings
        ),

        car: cumulative(
            financeState.balances.Car,
            changes.Car
        ),

        holiday: cumulative(
            financeState.balances.Holiday,
            changes.Holiday
        )
    };

    const difference = forecast.total.map((total, i) =>
    Math.round(total -
    (
        forecast.savings[i] +
        forecast.spending[i] +
        forecast.car[i] +
        forecast.holiday[i] +
        forecast.bills[i]
    ))
);

    return {
        dailyChange,
        changes,
        forecast,
        difference,
    };

}

const ctxY = document.getElementById("forecast-chart-year");
const ctxM = document.getElementById("forecast-chart-month")
const result = simulate(financeState);
const forecastChartYear= new Chart(ctxY, {
    type: "line",
    
    data: {
        datasets: [{
                label: "Total",
                data: result.forecast.total,
                borderColor: "darkcyan",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Spending",
                data: result.forecast.spending,
                borderColor: "slateblue",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Bills",
                data: result.forecast.bills,
                borderColor: "firebrick",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Savings",
                data: result.forecast.savings,
                borderColor: "green",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Car",
                data: result.forecast.car,
                borderColor: "black",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Holiday",
                data: result.forecast.holiday,
                borderColor: "orange",
                pointRadius: 0,
                borderWidth: 2,
            }
    ]
    },

    options: {
        responsive: true,
        scales: {y: { min: 0}},
        interaction: {
            mode: "index",
            intersect: false
        }
    }
});

const forecastChartMonth= new Chart(ctxM, {
    type: "line",
    
    data: {
        datasets: [{
                label: "Total",
                data: result.forecast.total,
                borderColor: "darkcyan",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Spending",
                data: result.forecast.spending,
                borderColor: "slateblue",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Bills",
                data: result.forecast.bills,
                borderColor: "firebrick",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Savings",
                data: result.forecast.savings,
                borderColor: "green",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Car",
                data: result.forecast.car,
                borderColor: "black",
                pointRadius: 0,
                borderWidth: 2,
            },
            {
                label: "Holiday",
                data: result.forecast.holiday,
                borderColor: "orange",
                pointRadius: 0,
                borderWidth: 2,
            }
    ]
    },

    options: {
        responsive: true,
        scales: {y: { min: 0}},
        interaction: {
            mode: "index",
            intersect: false
        }
    }
});

function updateForecastChart () {
    const result = simulate(financeState);

    const labels = dates.map(date =>
        date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short"
        })
    );

    forecastChartYear.data.datasets[0].data = result.forecast.total;
    forecastChartYear.data.datasets[1].data = result.forecast.spending;
    forecastChartYear.data.datasets[2].data = result.forecast.bills;
    forecastChartYear.data.datasets[3].data = result.forecast.savings;
    forecastChartYear.data.datasets[4].data = result.forecast.car;
    forecastChartYear.data.datasets[5].data = result.forecast.holiday;

    forecastChartMonth.data.datasets[0].data = result.forecast.total.slice(0, 31);
    forecastChartMonth.data.datasets[1].data = result.forecast.spending.slice(0, 31);
    forecastChartMonth.data.datasets[2].data = result.forecast.bills.slice(0, 31);
    forecastChartMonth.data.datasets[3].data = result.forecast.savings.slice(0, 31);
    forecastChartMonth.data.datasets[4].data = result.forecast.car.slice(0, 31);
    forecastChartMonth.data.datasets[5].data = result.forecast.holiday.slice(0, 31);

    forecastChartYear.data.labels = labels;
    forecastChartMonth.data.labels = labels.slice(0, 31);

    forecastChartYear.update();
    forecastChartMonth.update();

    generateYearText(result);
    generateMonthText(result);
}

function generateYearText (result) {
    const totalSavings = result.forecast.savings.at(-1);
    const monOut = Object.values(financeState.monthlyOutgoings)
        .reduce((sum, expense) => {
            return sum + Math.abs(expense.amount);
        }, 0); // Comes out as a positive number
    let html = `
        <div class="year-text">
            <div class="stats">
                <div class="stat">
                    <span>Total Savings:</span>
                    <strong>£${totalSavings.toFixed(0)}</strong>
                </div>
            
                <div class="stat">
                    <span>Monthly Outgoings:</span>
                    <strong>£${monOut.toFixed(0)}</strong>
                </div>
            </div>
        </div>
    `;

    containers.yearTextContainer.innerHTML = html
}

function generateMonthText(result) {
    const monthBalances = result.forecast.total.slice(0, 31);

    const minBalance = Math.min(...monthBalances);
    const maxBalance = Math.max(...monthBalances);

    let html = `
        <div class="month-text">
            <div class="stats">
                <div class="stat">
                    <span>Minimum balance</span>
                    <strong>£${minBalance.toFixed(2)}</strong>
                </div>

                <div class="stat">
                    <span>Maximum balance</span>
                    <strong>£${maxBalance.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    `;

    containers.monthTextContainer.innerHTML = html;
}

function generateBalances() {

    const balanceTotal = Object.values(financeState.balances).reduce((sum, val) => sum + val, 0);
        
    let html = '<div class="balance-section">';

    Object.entries(financeState.balances).forEach(([name, value]) => {

        const width = (value / balanceTotal) * 100;

        html += `
            <div class="balance-bar">
                <div class="balance-fill" style="width:${width}%">
                    <span class="balance-label">${name}</span>

                    <input
                        type="number"
                        value="${value}"
                        onchange="updateBalance('${name}', this.value)"
                        class="balance-input"
                    >
                </div>
            </div>
        `;
    });
    html += '</div>';

    html += `
        <div class="total-section">
            <div class="total-bar">
                <div class="total-text">
                    Total: £${balanceTotal.toFixed(2)}
                </div>
                <div class="total-fill"></div>
            </div>
        </div>
        ${createAxis(balanceTotal, 1000)}
    `;

    containers.balanceContainer.innerHTML = html;
}

function updateBalance(account, value) {
    financeState.balances[account] = Number(value);
    generateBalances();
    updateForecastChart();
}

function generateOutgoingsBar() {

    const expenses = Object.entries(financeState.monthlyOutgoings).sort((a, b) => Math.abs(b[1].amount) - Math.abs(a[1].amount));
    const outTotal = expenses.reduce((sum, [, info]) => {return sum + Math.abs(info.amount);}, 0);
    const maxOut = Math.max(outTotal*1.02, 700)

    const colours = [
        "#4caf50",
        "#2196F3",
        "#FF9800",
        "#E91E63",
        "#9C27B0",
        "#F44336",
        "#00BCD4"
    ];

    let outHtml = '<div class="outgoings-bar">';

    expenses.forEach(([name, info], index) => {
        const amount = Math.abs(info.amount);
        const width = (amount / maxOut) * 100;

        outHtml += `
            <div
                class="outgoing-section"
                style="
                    width:${width}%;
                    background:${colours[index % colours.length]};
                ">
                ${width >= 10 ? `<label>${name}: £${amount.toFixed(2)}</label>` : ""}
            </div>
        `;
    });

    outHtml += '</div>';
    outHtml += `<div class="pay-bar">
                    <div class="pay-fill"
                        style="width:${(financeState.pay / maxOut) * 100}%">
                        <label>Pay: £${financeState.pay.toFixed(2)}</label>
                    </div>
                </div>`
    outHtml += `${createAxis(outTotal, 100)}`;

    containers.outgoingsContainer.innerHTML = outHtml;

}

function createAxis(maxValue, step) {
    let html = '<div class="bar-axis">';

    const divisions = maxValue/step
    for (let i = 0; i <= divisions; i++) {
        const value = Math.round(((maxValue / divisions) * i)/100)*100;
        html += `
            <div class="axis-tick">
                <div class="tick-line"></div>
                <span>£${Math.round(value)}</span>
            </div>
        `;
    }

    html += '</div>';

    return html;
}

function generateExpenseSliders() {

    let html = "";

    Object.entries(financeState.monthlyOutgoings).forEach(([name, expense]) => {

        if (expense.type !== "weekly") return;

        html += `
            <div class="slider-row">

                <label>
                    ${name}: £<span id="${name}-value">${Math.abs(expense.amount)}</span>
                </label>

                <input
                    type="range"
                    min="0"
                    max="250"
                    value="${Math.abs(expense.amount)}"
                    oninput="updateWeeklyExpense('${name}', this.value)"
                >

            </div>
        `;
    });

    containers.sliderContainer.innerHTML = html;
}

function updateWeeklyExpense(name, value) {

    financeState.monthlyOutgoings[name].amount = -Number(value);

    document.querySelector(`#${name}-value`).textContent = value;

    generateOutgoingsBar();
    updateForecastChart();
}

function initializeFinancePage() {
    generateBalances()
    generateOutgoingsBar()
    generateExpenseSliders();
    updateForecastChart();

    const result = simulate(financeState);
    console.log("result:", result);
    console.log("total (last day):", result.forecast.total.at(-1));
    console.log("spending (last day):", result.forecast.spending.at(-1));
    console.log("Min balance:", Math.min(...result.forecast.total));
    console.log("Max balance:", Math.max(...result.forecast.total));
}

initializeFinancePage()