document.addEventListener("DOMContentLoaded", function () {

    const taskTextInput = document.getElementById('task-text'),
        taskDateInput = document.getElementById('task-date'),
        clearPrimaryListBtn = document.getElementById('clear-primary-list-btn'),
        addPirmaryTaskBtn = document.getElementById('add-primary-task-btn'),
        clearSecondaryListBtn = document.getElementById('clear-secondary-list-btn'),
        addSecodnaryTaskBtn = document.getElementById('add-secondary-task-btn'),
        markAllTasksBtn = document.getElementById('mark-all-tasks'),
        primaryTasksList = document.getElementById('pirmary-tasks-list'),
        secondaryTasksList = document.getElementById('secondary-tasks-list'),
        modal = document.getElementById('modal'),
        clodeModalBtn = document.getElementById('modal-btn');

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [],
        NewTask = function (taskText, taskDate, taskPriority) {
            this.taskText = taskText;
            this.taskDate = taskDate;
            this.isCompleted = false;
            this.id = Date.now();
            this.taskPriority = taskPriority;
        },
        priority = '';

    function getTaskIndex(task) {
        let id = task.parentElement.parentElement.dataset.id;

        return tasks.map((singleTask) => {
            return singleTask.id;
        }).indexOf(parseInt(id));
    }

    function isTasksValid() {
        return tasks.length > 0;
    }

    function toggleCompletedTask() {
        if (this.checked) {
            tasks[getTaskIndex(this)].isCompleted = true;
        } else {
            tasks[getTaskIndex(this)].isCompleted = false;
        }
        saveTasks(tasks);
    }

    function isAllTasksCompleted() {
        let valid = false,
            falseIndex = 0;

        if (isTasksValid()) {
            falseIndex = tasks.map((singleTask) => {
                return singleTask.isCompleted;
            }).indexOf(false);
        }
        if (falseIndex < 0) {
            valid = true;
        }

        return valid;
    }

    function toogleMarkAllTasksBtn() {
        if (isAllTasksCompleted()) {
            markAllTasksBtn.checked = true;
        } else {
            markAllTasksBtn.checked = false;
        }
    }

    function addEventsToCheckboxes() {
        let chceckboxes = document.getElementsByClassName('js-checkbox-completed');
        for (let i = 0; i < chceckboxes.length; i++) {
            chceckboxes[i].addEventListener('click', toggleCompletedTask);
            chceckboxes[i].addEventListener('click', toogleMarkAllTasksBtn);
        }
    }

    function markTaskAsCompleted(task, checkBox) {
        if (task.isCompleted) {
            checkBox.checked = true;
        }
    }

    function createTaskLine(task) {
        let taskLine = document.createElement('li'),
            checkBoxContainer = document.createElement('div'),
            checkBox = document.createElement('input'),
            checkBoxLabel = document.createElement('label'),
            taskTextSpan = document.createElement('span'),
            taskDateSpan = document.createElement('span');

        checkBoxContainer.classList.add('checkbox-container');
        checkBox.type = "checkbox";
        checkBox.classList.add('js-checkbox-completed', 'checkbox');
        checkBox.id = task.id;
        checkBoxLabel.setAttribute('for', task.id);
        checkBoxLabel.classList.add('checkbox-label');
        taskTextSpan.classList.add('task-line-text');
        taskDateSpan.classList.add('task-line-date');
        checkBoxContainer.appendChild(checkBox);
        checkBoxContainer.appendChild(checkBoxLabel);
        taskLine.appendChild(checkBoxContainer);
        taskLine.appendChild(taskTextSpan);
        taskLine.appendChild(taskDateSpan);
        taskTextSpan.innerText = task.taskText;
        taskDateSpan.innerText = task.taskDate;
        taskLine.classList.add('js-task-line', 'task-line');
        taskLine.dataset.id = task.id;
        markTaskAsCompleted(task, checkBox);

        return taskLine;
    }

    function renderTasks(tasks) {
        if (isTasksValid()) {
            primaryTasksList.innerHTML = '';
            secondaryTasksList.innerHTML = '';

            for (let task of tasks) {
                task.taskPriority === 'primary' ? primaryTasksList.appendChild(createTaskLine(task)) : secondaryTasksList.appendChild(createTaskLine(task));
            }
            addEventsToCheckboxes();
        }
    }

    function clearInputState() {
        taskTextInput.value = '';
        taskDateInput.value = '';
        taskDateInput.placeholder = new Date().toLocaleDateString();
    }

    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function isTaskValid() {
        return taskTextInput.value.length > 2 && taskTextInput.value.length < 100;
    }

    function showModal() {
        modal.classList.remove('closeModal');
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.classList.add('closeModal');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    function addTask(e) {
        taskDateInput.value = taskDateInput.value || new Date().toLocaleDateString();
        if (isTaskValid()) {
            e.target.id === 'add-primary-task-btn' ? priority = 'primary' : priority = 'secondary';
            let task = new NewTask(taskTextInput.value, taskDateInput.value, priority);
            tasks.push(task);
            saveTasks(tasks);
            renderTasks(tasks);
            clearInputState();
            toogleMarkAllTasksBtn();
        } else {
            showModal();
        }
    }

    function removeTasksFromStorage(priority) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskPriority === priority) {
                tasks.splice(i, 1);
                saveTasks(tasks);
                i -= 1;
            }
        }
    }

    function deleteTasks(e) {

        if (e.target.id === 'clear-primary-list-btn') {
            primaryTasksList.innerHTML = '';
            priority = 'primary';
        } else {
            secondaryTasksList.innerHTML = '';
            priority = 'secondary';
        }
        removeTasksFromStorage(priority);
        toogleMarkAllTasksBtn();
    }

    function markAllTasks() {
        if (this.checked) {
            for (let task of tasks) {
                task.isCompleted = true;
            }
        } else {
            for (let task of tasks) {
                task.isCompleted = false;
            }
        }
        saveTasks(tasks);
        renderTasks(tasks);
    }

    clearPrimaryListBtn.addEventListener('click', deleteTasks);
    addPirmaryTaskBtn.addEventListener('click', addTask);
    clearSecondaryListBtn.addEventListener('click', deleteTasks);
    addSecodnaryTaskBtn.addEventListener('click', addTask);
    clodeModalBtn.addEventListener('click', closeModal);
    markAllTasksBtn.addEventListener('click', markAllTasks);
    renderTasks(tasks);
    clearInputState();
    toogleMarkAllTasksBtn();

});