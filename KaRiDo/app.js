// Счётчик для индекса задач в LocalStorage
let numOfTasksInStorage = 0;
// Копия задач из LocalStorage
let tasksInStorage = {};
// Drag&Drop
let draggables = document.querySelectorAll(".draggable");
// Анимация печатающегося текста
const typingSubtitle = document.querySelector(".p-editable");


// Загрузка задач из LocalStorage - вызывается при загрузке DOM
function syncHostToStorage(){
    // Если задачи существуют
    if(localStorage.getItem("TasksInStorage") != null){
        // Получаем задачи из LocalStorage
        tasksInStorage = JSON.parse(localStorage.getItem("TasksInStorage"));

        // Добавление всех задач из localStorage в DOM
        for (key in tasksInStorage) {

            let currentTaskFromStorage = tasksInStorage[key];

            // Находим разделитель
            let indexOfDivider = currentTaskFromStorage.indexOf("~");

            let text = currentTaskFromStorage.slice(0, indexOfDivider);
            let color = currentTaskFromStorage.slice(indexOfDivider + 1);
            
            // Замена текста задачи в шаблоне
            textOfTaks.textContent = text;
            
            // Копия заполненного шаблона
            let templateCopy = template.content.cloneNode(true);

            // Добавляем новую задачу
            taskList.append(templateCopy);

            // Вставка цвета задачи
            document.querySelector(".todo-task:last-of-type").style.borderLeft = `2px solid ${color}`;

            // Обновляем счётчик для задач
            numOfTasksInStorage = key;
        }
        numOfTasksInStorage++;

        // Drag&Drop обработчики для задач
        draggables = document.querySelectorAll(".draggable");
        addDnDListeners();

        // Загрузка изменённых надписей (contentEditable)
        if(localStorage.getItem("p-editable") != null){
            document.querySelector(".p-editable").textContent = localStorage.getItem("p-editable");
        }
        if(localStorage.getItem("span-editable") != null){
            document.querySelector(".span-editable").textContent = localStorage.getItem("span-editable");
        }
        if(localStorage.getItem("h1-editable") != null){
            document.querySelector(".h1-editable").textContent = localStorage.getItem("h1-editable");
        }

        // Анимация печатающегося текста
        textTyping(document.querySelector(".p-editable"));

    } 
}
// При загрузке DOM, задачи из localStorage добавляются на страницу
addEventListener("DOMContentLoaded", syncHostToStorage);


// Input ввода текста задачи
const inputTask = document.querySelector(".input-task");
// Контейнер для списка задач
const taskList = document.querySelector(".task-list");
// Шаблон задачи
const template = document.querySelector("template");
// Тег текста задачи в шаблоне
const textOfTaks = template.content.querySelector("p");

// Добавление задачи
function addTask(){
    if (inputTask.value != ""){
        // Вставка текста из input'a
        textOfTaks.textContent = inputTask.value;

        // Копия заполненного шаблона
        let templateCopy = template.content.cloneNode(true);

        // Добавление цветового тега
        templateCopy.querySelector(".todo-task").style.borderLeft = `2px solid ${currentColor}`;

        // Добавляем новую задачу
        taskList.append(templateCopy);

        // Добавление в LocalStorage
        tasksInStorage[numOfTasksInStorage] = inputTask.value + `~${currentColor}`;
        numOfTasksInStorage++;
        localStorage.setItem("TasksInStorage", JSON.stringify(tasksInStorage));

        // Удаляем введённый текст в input
        inputTask.value = "";

        // Drag&Drop
        draggables = document.querySelectorAll(".draggable");
        removeDnDListeners();
        addDnDListeners();

    }
}
// Добавление задачи нажатием на кнопку
const addTaskButton = document.querySelector(".addTaskButton");
addTaskButton.addEventListener("click", addTask);

// Добавление задачи нажатием Enter'а
document.addEventListener("keyup", (e) => {
    if (e.key == "Enter"){
        addTask();
    };
});


// Выполнение задачи - вызывается из HTML кода
function taskDone(elem){
    const taskBlock = elem.parentNode;
    // Если задача не выполнена
    if(taskBlock.querySelector(".taskDoneImg").style.opacity == 0){
        taskBlock.querySelector(".taskDoneImg").style.opacity = 1;
        taskBlock.querySelector("p").style.color = "#A8A8B4";
        taskBlock.querySelector("p").style.textDecoration = "line-through #A8A8B4";
    }else{
        taskBlock.querySelector(".taskDoneImg").style.opacity = 0;
        taskBlock.querySelector("p").style.color = "#575767";
        taskBlock.querySelector("p").style.textDecoration = "none";
    }
}


// Удаление задачи - вызывается из HTML кода
function deleteTask(elem){
    // Получение конкретной задачи
    const currentTask = elem.parentNode;
    // Текст задачи для поиска ключа
    let textOfTask = currentTask.querySelector("p").textContent;
    // Массив ключей всех задач
    let arrOfKeys = Object.keys(tasksInStorage);

    // Ищем ключ по тексту задачи
    for (let numOfKeyInArr in arrOfKeys){
        if (tasksInStorage[arrOfKeys[numOfKeyInArr]].includes(textOfTask)){
            // Удаляем найденное свойство
            delete tasksInStorage[arrOfKeys[numOfKeyInArr]];
            // Вносим новый объект в localStorage, заменяя им прошлую версию
            localStorage.setItem("TasksInStorage", JSON.stringify(tasksInStorage));
        }
    }
    // Удаление задачи из DOM дерева
    currentTask.remove();
}


// --------------------------------------------------------------------------------------------
// Добавление цветовых тегов для задачи
let isColorPickerOpened = false;
let currentColor = "rgb(226 21 21)";

const colorPicker = document.querySelector(".colorPicker");
const colorPickerButton = document.querySelector('.colorPickerButton');
// Открытие модульного окна
colorPickerButton.addEventListener("click", colorPickerAppearance);

function colorPickerAppearance() {
    if (isColorPickerOpened == false){
        isColorPickerOpened = true;
        let inputTaskPosition = inputTask.getBoundingClientRect();
        colorPicker.style.display = "block";
        colorPicker.style.top = inputTaskPosition.top + window.pageYOffset - 80 + "px";
    } else{
        isColorPickerOpened = false;
        colorPicker.style.display = "none";
    }    
}
// Выбор цвета
const colorPickerItems = document.querySelectorAll(".colorPickerItem");
for (let numOfColorButton = 0; numOfColorButton < colorPickerItems.length; numOfColorButton++) {
    let colorButton = colorPickerItems[numOfColorButton];
    colorButton.addEventListener("click", colorChanger)
}
function colorChanger(){
    currentColor = this.style.backgroundColor;
    isColorPickerOpened = false;
    colorPicker.style.display = "none";
    colorPickerButton.style.backgroundColor = currentColor;
};


// --------------------------------------------------------------------------------------------
// Drag&Drop
// Элементы DnD - draggables
// Единственный контейнер для ToDo - taskList

// Для draggable элементов
function addDnDListeners() {
    draggables.forEach(DnDElement => {
        // Desktop
        DnDElement.addEventListener("dragstart", dragStart);
        DnDElement.addEventListener("dragend", dragEnd);
        // Mobile
        DnDElement.addEventListener("touchstart", dragStart);
        DnDElement.addEventListener("touchend", dragEnd);
    });
}
function dragStart() {
    this.classList.add("dragging");
}
function dragEnd() {
    this.classList.remove("dragging");
}
function removeDnDListeners() {
    draggables.forEach(DnDElement => {
        // Desktop
        DnDElement.removeEventListener("dragstart", dragStart);
        DnDElement.removeEventListener("dragend", dragEnd);
        // Mobile
        DnDElement.removeEventListener("touchstart", dragStart);
        DnDElement.removeEventListener("touchend", dragEnd);
    });
}

// Для dropabble контейнера (taskList)
// Desktop
taskList.addEventListener("dragover", dragOver);
// Mobile
taskList.addEventListener("touchmove", dragOverMobile);

// Desktop
function dragOver(e) {
    e.preventDefault();
    // Выясним перед каким элементом нужно вставить dragging элемент

    nextDnDElement = getNextDnDElement(e.clientY);

    const dragging = document.querySelector(".dragging");

    if (nextDnDElement == null){
        taskList.append(dragging);
    } else{
        taskList.insertBefore(dragging, nextDnDElement);
    }
}
// Mobile
function dragOverMobile(e) {
    e.preventDefault();
    // Выясним перед каким элементом нужно вставить dragging элемент

    nextDnDElement = getNextDnDElement(e.targetTouches[0].clientY);

    const dragging = document.querySelector(".dragging");

    if (nextDnDElement == null){
        taskList.append(dragging);
    } else{
        taskList.insertBefore(dragging, nextDnDElement);
    }
}

// Получаем следующий элемент после указателя мыши
function getNextDnDElement(y) {
    // Начальное значение для сравнения
    let previousDistanceToDragging = Number.NEGATIVE_INFINITY;
    let nextDnDElement = null;
    
    let allOtherDraggables = [...document.querySelectorAll(".draggable:not(.dragging)")];

    allOtherDraggables.forEach(currentDraggable => {
        
        const box = currentDraggable.getBoundingClientRect();
        // Высчитываем центр draggable item'a
        const distanceToDragging = y - box.top - box.height / 2;
        // Нужно найти наиближайшее значение к мыши, но меньшее нуля
        if (distanceToDragging > previousDistanceToDragging && distanceToDragging < 0){
            previousDistanceToDragging = distanceToDragging;
            nextDnDElement = currentDraggable;
        }
    });

    return nextDnDElement;
}


// --------------------------------------------------------------------------------------------
// Работа с таймером
const time = {
    total: 0,
    h: 0,
    m: 0,
    s: 0,
}
// Переменная для setInterval
let interval = null;
// Инициализируем звуковой файл
let alarm = new Audio("audio/alarm.mp3");

// input'ы начального и оставшегося времени
const initialTime = document.querySelector(".setup-timer");
const remainingTime = document.querySelector(".remaining-timer");

// Запуск таймера
const startButton = document.querySelector(".start-timer");
startButton.addEventListener("click", startTimer);
function startTimer(){
    // Синхронизируем время
    remainingTime.value = initialTime.value;

    // Блок двойного запуска таймера
    startButton.disabled = true;
    
    // Расчёт актуального времени
    time.h = +initialTime.value.slice(0,2);
    time.m = +initialTime.value.slice(3, 5);
    time.s = +initialTime.value.slice(6);
    time.total = time.h*60*60 + time.m*60 +time.s;

    interval = setInterval(timerCountdown, 1000);
    // Ежесекундный перерасчёт времени
    function timerCountdown(){

        if(time.total > 0){

            time.total--;
            time.h = Math.floor(time.total/3600);
            time.m = Math.floor((time.total % 3600) / 60);
            time.s = time.total - (time.h*3600 + time.m*60);

            let hStr = 0;
            let mStr = 0;
            let sStr = 0;
            if (time.h < 10){
                hStr = "0" + time.h;
            } else{
                hStr = String(time.h);
            }

            if (time.m < 10){
                mStr = "0" + time.m;
            } else{
                mStr = String(time.m);
            }

            if (time.s < 10){
                sStr = "0" + time.s;
            } else{
                sStr = String(time.s);
            }

            remainingTime.value = `${hStr}:${mStr}:${sStr}`;
        }
        if(time.total == 0){
            // Сбрасываем интервал по завершению
            clearInterval(interval);

            // Возврат возможности запуска таймера
            startButton.disabled = false;

            // Звук таймера
            alarm.play();
            setTimeout(()=>{
                alarm.pause();
                alarm.currentTime = 0.0;
            }, 5000);
        }
    }
}

// Сброс таймера
const resetButton = document.querySelector(".reset-timer");
resetButton.addEventListener("click", resetTimer);
function resetTimer() {
    // Сбрасываем интервал по завершению
    clearInterval(interval);

    remainingTime.value = "00:00:00";

    time.h = 0;
    time.m = 0;
    time.s = 0;
    time.total = 0;

    // Сброс звука таймера
    alarm.pause();
    alarm.currentTime = 0.0;

    // Возврат возможности запуска таймера
    startButton.disabled = false;
}


// --------------------------------------------------------------------------------------------
// Сохранение изменённых надписей с contentEditable = true
const contendEditable = document.querySelectorAll("*[contenteditable=true]");

contendEditable.forEach(editable => {
    editable.onblur = (e)=>{
        // Массив всех классов элемента
        const classes = e.target.classList.value.split(" ");
        // Нужный класс - всегда последний
        const selector = classes[classes.length - 1];
        // Запись в LocalStorage
        localStorage.setItem(selector, e.target.innerText)
    };
});


// --------------------------------------------------------------------------------------------
// Модальное окно помощи
const helpButton = document.querySelector(".help-button");
const modalHelp = document.querySelector(".modal-help");
const modalHelpButton = document.querySelector(".modal-help button");
const overlay = document.querySelector(".overlay");

helpButton.addEventListener("click", () => {
    modalHelp.classList.add("active");
    overlay.classList.add("active");
});
modalHelpButton.addEventListener("click", () => {
    modalHelp.classList.remove("active");
    overlay.classList.remove("active");
});
overlay.addEventListener("click", () => {
    modalHelp.classList.remove("active");
    overlay.classList.remove("active");
});


// Анимация печатающегося текста
function textTyping(element){
    let string = element.innerText;
    let index = 1;

    const interval = setInterval(() => {
        element.innerText = string.slice(0, index);
        index++;
        if (index > string.length){
            clearInterval(interval);
        }
    }, 60);
};


