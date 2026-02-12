window.addEventListener('load', () => {
	//DOM ELEMENT REFERENCES
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const list_el = document.querySelector("#tasks");
	const submitBtn = document.querySelector("#new-task-submit");

	//INITIAL UI STATE
	submitBtn.disabled = true;

	//LIVE INPUT VALIDATION
	input.addEventListener("input", () => {
		const trimmedValue = input.value.trim();

		if(trimmedValue === "") {
			submitBtn.disabled = true;
		} else {
			submitBtn.disabled = false;
		}
	});

	//FORM SUBMISSION LOGIC
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const task = input.value.trim();

		if(task === "") {
			return;
		}

		//TASK CREATION LOGIC
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.classList.add("checkbox");

		const task_el = document.createElement('div');
		task_el.classList.add('task');

		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');

		task_el.appendChild(task_content_el);

		checkbox.addEventListener("change", () => {
			if(checkbox.checked) {
				task_el.classList.add("completed");
			} else {
				task_el.classList.remove("completed");
			}
		});

		const task_input_el = document.createElement('input');
		task_input_el.classList.add('text');
		task_input_el.type = 'text';
		task_input_el.value = task;
		task_input_el.setAttribute('readonly', 'readonly');

		task_content_el.appendChild(task_input_el);

		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');
		
		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';

		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);

		task_el.appendChild(task_actions_el);

		list_el.appendChild(task_el);

		input.value = '';
		submitBtn.disabled = true;

		task_edit_el.addEventListener('click', (e) => {
			
		if(task_el.classList.contains("completed")){
			return;
		}
		
			if (task_edit_el.innerText.toLowerCase() == "edit") {
				task_edit_el.innerText = "Save";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Edit";
				task_input_el.setAttribute("readonly", "readonly");
			}
		});

		task_delete_el.addEventListener('click', (e) => {
			list_el.removeChild(task_el);
		});
	});
});