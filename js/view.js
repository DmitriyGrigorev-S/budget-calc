var viewController = (function () {
    var DOMstrings = {
        inputType: "#input__type",
        inputDescription: "#input__description",
        inputValue: "#input__value",
        form: "#budget-form",
        incomeContainer: "#income__list",
        expenseContainer: "#expenses__list",
        budgetLabel: "#budget-value",
        incomeLabel: "#income-label",
        expensesLabel: "#expense-label",
        expensesPercentLabel: "#expense-percent-label",
        budgetTable: "#budget-table",
        monthLabel: "#month",
        yearLabel: "#year"
    };

    function getInput() {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription)
                .value,
            value: document.querySelector(DOMstrings.inputValue).value
        };
    }

    function formatNumber(num, type) {
        var numSplit, int, dec, newInt, resultNumber;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split(".");
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            newInt = '';

            console.log(int.length);
            for (var i = 0; i < int.length / 3; i++) {
                console.log(i);

                newInt = ',' + int.substring(int.length - 3 * (i + 1), int.length - 3 * i) + newInt;

                console.log('newInt', newInt);
            }
            console.log('newInt', newInt);

            if (newInt[0] === ',') {
                newInt = newInt.substring(1);
            }
        } else if (int === '0') {
            newInt = '0';
        } else {
            newInt = int;
        }

        resultNumber = newInt + "." + dec;

        if (type === 'exp') {
            resultNumber = '- ' + resultNumber;
        } else if (type === 'inc') {
            resultNumber = '+ ' + resultNumber;
        }

        return resultNumber;
    }

    function renderListItem(obj, type) {
        var containerElement, html;

        if (type === "inc") {
            containerElement = DOMstrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">%value%</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`;
        } else {
            containerElement = DOMstrings.expenseContainer;
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">
                                %value%
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                        15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`;
        }

        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

        document
            .querySelector(containerElement)
            .insertAdjacentHTML("beforeend", newHtml);
    }

    function clearFields() {
        var inputDesc, inputVal;

        inputDesc = document.querySelector(DOMstrings.inputDescription);
        inputVal = document.querySelector(DOMstrings.inputValue);

        inputDesc.value = "";
        inputDesc.focus();

        inputVal.value = "";
    }

    function updateBudget(obj) {
        var type;
        /*
        {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
        budgetLabel: "#budget-value",
        incomeLabel: "#income-label",
        expensesLabel: "#expense-label",
        expensesPercentLabel: "#expense-percent-label"
        */

        if (obj.budget > 0) {
            type = 'inc'
        } else {
            type = 'exp'
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = obj.percentage;
        } else {
            document.querySelector(DOMstrings.expensesPercentLabel).textContent = "--";
        }
    }

    function deleteListItem(itemID) {
        document.getElementById(itemID).remove();
    }

    function updateItemsPercentages(items) {

        items.forEach(function (item) {

            // Выводим каждую запись массива во время прохода
            console.log("updateItemsPercentages -> item", item);  // [5, 26]

            // Находим блок с процентами внутри текущей записи
            var el = document.getElementById(`exp-${item[0]}`).querySelector(".item__percent");
            console.log("updateItemsPercentages -> el", el);

            // el.textContent = item[1] + "%";

            // Делаю проверку если значение % = "-1" когда нет доходов
            if (item[1] >= 0) {
                // Если есть - то показываем блок с %
                el.parentElement.style.display = "block";
                // Меняем контент внутри бейджа с процентами
                el.textContent = item[1] + "%";
            } else {
                // Если нет - то скрываем бейдж с процентами
                el.parentElement.style.display = "none";
            }


        });
    }

    function displayMonth() {
        var now, year, month;

        now = new Date();
        year = now.getFullYear();
        month = now.getMonth();

        monthArr = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];

        month = monthArr[month];

        document.querySelector(DOMstrings.monthLabel).innerText = month;
        document.querySelector(DOMstrings.yearLabel).innerText = year;
    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercentages: updateItemsPercentages,
        formatNumber: formatNumber,
        displayMonth: displayMonth,
        getDomStrings: function () {
            return DOMstrings;
        }
    };
})();
