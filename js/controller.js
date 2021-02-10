var controller = (function (budgetCtrl, uiCtrl) {
    var setupEventListeners = function () {
        var DOM = uiCtrl.getDomStrings();
        document
            .querySelector(DOM.form)
            .addEventListener("submit", ctrlAddItem);

        // Клик по таблице с доходами и расходами
        document
            .querySelector(DOM.budgetTable)
            .addEventListener("click", ctrlDeleteItem);
    };

    // Обновляем проценты у каждой записи
    function updatePercentages() {

        // 1. Посчитать проценты для каждой записи типа Expense
        budgetCtrl.calculatePercentages();
        budgetCtrl.test();

        // 2. Получаем данные по процентам с модели
        var idsAndPercents = budgetCtrl.getAllIdsAndPercentages();
        console.log("updatePercentages -> idsAndPercents", idsAndPercents)

        // 3. Обновить UI с новыми процентами
        uiCtrl.updateItemsPercentages(idsAndPercents);


    }

    // Функция срабатывающая при отправке формы
    function ctrlAddItem(event) {
        event.preventDefault();

        // 1. Получить данные из формы
        var input = uiCtrl.getInput();

        // Проверка что поля не пустые
        if (
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Добавить полученные данные в модель
            var newItem = budgetCtrl.addItem(
                input.type,
                input.description,
                input.value
            );
            budgetCtrl.test();

            // 3. Добавить "запись" в UI
            uiCtrl.renderListItem(newItem, input.type);
            uiCtrl.clearFields();
            generateTestData.init();

            // 4. Посчитать бюджет
            updateBudget();

            // 5. Пересчитали проценты
            updatePercentages();
        } // endIf
    }

    function ctrlDeleteItem(event) {
        var itemID, splitID, type, ID;

        if (event.target.closest(".item__remove")) {
            // Находим ID записи которую надо удалить
            itemID = event.target.closest("li.budget-list__item").id; // inc-0
            splitID = itemID.split("-"); // "inc-0" => ["inc", "0"]
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Удаляем запись из модели
            budgetCtrl.deleteItem(type, ID);

            // Удаляем запись из шаблона
            uiCtrl.deleteListItem(itemID);

            // Посчитать бюджет
            updateBudget();

            // Пересчитали проценты
            updatePercentages();
        }
    }

    function updateBudget() {
        // 1. Расчитать бюджет в модели
        budgetCtrl.calculateBudget();

        // 2. Получить расчитанный бюджет из модели
        budgetObj = budgetCtrl.getBudget();
        console.log("updateBudget -> budgetObj", budgetObj);

        // 3. Отобразить бюджет в Шаблоне
        uiCtrl.updateBudget(budgetObj);
    }

    return {
        init: function () {
            console.log("App started!");
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
            
        },
    };
})(modelController, viewController);

controller.init();
