window.addEventListener('load', () => {

    // ================= DOM REFERENCES =================
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const submitBtn = document.querySelector("#new-task-submit");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.querySelector("#clear-completed");
    const clearAllBtn = document.querySelector("#clear-all");

    // ================= STATE =================
    let currentFilter = "all";
    let tasks = [];

    submitBtn.disabled = true;
    input.focus();

    // ================= VALIDATION =================
    input.addEventListener("input", () => {
        const trimmedValue = input.value.trim();
        submitBtn.disabled = trimmedValue === "";
    });

    // ================= LOCAL STORAGE =================
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem("tasks");

        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            tasks.forEach(taskObj => createTaskElement(taskObj));
        }
    }

    // ================= FILTER =================
    function applyFilter() {
        const taskElements = document.querySelectorAll(".task");

        taskElements.forEach(taskEl => {
            const isCompleted = taskEl.classList.contains("completed");

            if (currentFilter === "all") {
                taskEl.style.display = "flex";
            } 
            else if (currentFilter === "active") {
                taskEl.style.display = isCompleted ? "none" : "flex";
            } 
            else if (currentFilter === "completed") {
                taskEl.style.display = isCompleted ? "flex" : "none";
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            applyFilter();
        });
    });

    // ================= CLEAR ACTIONS =================
    clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();

        document.querySelectorAll(".task").forEach(el => {
            if (el.classList.contains("completed")) el.remove();
        });

        applyFilter();
    });

    clearAllBtn.addEventListener("click", () => {
        tasks = [];
        saveTasks();
        list_el.innerHTML = "";
    });

    // ================= CREATE TASK ELEMENT =================
    function createTaskElement(taskObj) {

        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskObj.text;
        task_input_el.setAttribute("readonly", "readonly");

        let originalValue = task_input_el.value;

        if (taskObj.completed) {
            checkbox.checked = true;
            task_el.classList.add("completed");
        }

        task_content_el.appendChild(checkbox);
        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerText = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerText = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_content_el);
        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        // ===== CHECKBOX =====
        checkbox.addEventListener("change", () => {
            taskObj.completed = checkbox.checked;
            saveTasks();

            if (checkbox.checked) {
                task_el.classList.add("completed");
            } else {
                task_el.classList.remove("completed");
            }

            applyFilter();
        });

        // ===== KEYBOARD =====
        task_input_el.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {
                task_input_el.value = originalValue;
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
            }

            if (e.key === "Enter") {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";

                taskObj.text = task_input_el.value;
                saveTasks();
            }
        });

        // ===== EDIT BUTTON =====
        task_edit_el.addEventListener("click", () => {

            if (task_el.classList.contains("completed")) return;

            if (task_edit_el.innerText.toLowerCase() === "edit") {

                originalValue = task_input_el.value;

                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();

            } else {

                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");

                taskObj.text = task_input_el.value;
                saveTasks();
            }
        });

        // ===== DELETE =====
        task_delete_el.addEventListener("click", () => {

            tasks = tasks.filter(t => t !== taskObj);
            saveTasks();

            task_el.remove();
        });

        applyFilter();
    }

    // ================= SUBMIT =================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = input.value.trim();
        if (taskText === "") return;

        const taskObj = {
            text: taskText,
            completed: false
        };

        tasks.push(taskObj);
        saveTasks();

        createTaskElement(taskObj);

        input.value = "";
        submitBtn.disabled = true;
    });

    // ================= LOAD SAVED TASKS =================
    loadTasks();

});
