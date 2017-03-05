document.addEventListener("DOMContentLoaded", () => {

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
        priority = '';

    function Task(taskText, taskDate, taskPriority) {
        this.taskText = taskText;
        this.taskDate = taskDate;
        this.isCompleted = false;
        this.id = Date.now();
        this.taskPriority = taskPriority;
    }

    function getTaskIndex(task) {
        let id = task.id;

        return tasks.map((singleTask) => {
            return singleTask.id;
        }).indexOf(parseInt(id));
    }

    function areTasksValidToRender() {
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

    function areAllTasksCompleted() {
        if (areTasksValidToRender()) {
            return tasks.every((task) => {
                return task.isCompleted;
            });
        }
    }

    function toogleMarkAllTasksBtn() {
        if (areAllTasksCompleted()) {
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

    function markTaskAsCompleted(tasks) {
        for (let task of tasks) {
            if (task.isCompleted) {
                let checkbox = document.getElementById(task.id);
                checkbox.checked = true;
            }
        }

    }

    function createTaskLine(task) {
        let taskLine = '<li class="js-task-line task-line"><div class="checkbox-container"><form><input type="checkbox" name="task-completed" id="' + task.id + '" class="js-checkbox-completed checkbox"></input><label class="checkbox-label" for="' + task.id + '"></label></form></div><span class="task-line-text">' + task.taskText + '</span><span class="task-line-date">' + task.taskDate + '</span></li>';

        return taskLine;
    }

    function renderTasks(tasks) {
        if (areTasksValidToRender()) {
            primaryTasksList.innerHTML = '';
            secondaryTasksList.innerHTML = '';

            let primaryList = '',
                secondaryList = '';
            for (let task of tasks) {
                task.taskPriority === 'primary' ? primaryList += createTaskLine(task) : secondaryList += createTaskLine(task);
            }
            primaryTasksList.innerHTML = primaryList;
            secondaryTasksList.innerHTML = secondaryList;
            markTaskAsCompleted(tasks);
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

    function isTaskTextInvalid() {
        let minLength = 3,
            maxLength = 100;

        return taskTextInput.value.trim().length < minLength || taskTextInput.value.trim().length > maxLength;
    }

    function showModal() {
        modal.classList.remove('closeModal');
        modal.style.display = 'block';
    }

    function closeModal() {
        let modalHidingTime = 300;

        modal.classList.add('closeModal');
        setTimeout(() => {
            modal.style.display = 'none';
        }, modalHidingTime);
    }

    function addTask(e) {
        if (isTaskTextInvalid()) {
            showModal();
            return;
        }
        taskDateInput.value = taskDateInput.value || new Date().toLocaleDateString();
        e.target.id === 'add-primary-task-btn' ? priority = 'primary' : priority = 'secondary';
        let task = new Task(taskTextInput.value, taskDateInput.value, priority);
        tasks.push(task);
        saveTasks(tasks);
        renderTasks(tasks);
        clearInputState();
        toogleMarkAllTasksBtn();
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

    function markAllTasksAsCompleted() {
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
    markAllTasksBtn.addEventListener('click', markAllTasksAsCompleted);
    renderTasks(tasks);
    clearInputState();
    toogleMarkAllTasksBtn();

});