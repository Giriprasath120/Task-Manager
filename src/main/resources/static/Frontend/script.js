const BASE_URL = "http://localhost:8080/tasks";

// 🔹 Load all tasks
function loadTasks() {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
        let output = "";

        data.forEach(task => {
            output += `
                <div class="task">
                    <p><b>${task.title}</b></p>
                    <p>${task.deadline} | ${task.priority}</p>

                    <button onclick="editTask(${task.id}, '${task.title}', '${task.deadline}', '${task.priority}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
        });

        document.getElementById("taskList").innerHTML = output;
    })
    .catch(err => console.error("Error loading tasks:", err));
}


// 🔹 Add new task
function addTask() {
    const title = document.getElementById("title").value.trim();
    const deadline = document.getElementById("deadline").value.trim();
    const priority = document.getElementById("priority").value.trim();

    if (!title || !deadline || !priority) {
        alert("Please fill all fields");
        return;
    }

    const task = {
        title,
        deadline,
        priority,
        completed: false
    };

    fetch(BASE_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(task)
    })
    .then(() => {
        clearForm();
        loadTasks();
    })
    .catch(err => console.error("Error adding task:", err));
}


// 🔹 Delete task
function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        loadTasks();
    })
    .catch(err => console.error("Error deleting task:", err));
}


// 🔹 Edit task (with prompt)
function editTask(id, oldTitle, oldDeadline, oldPriority) {
    const newTitle = prompt("Enter new title:", oldTitle);
    const newDeadline = prompt("Enter new deadline (YYYY-MM-DD):", oldDeadline);
    const newPriority = prompt("Enter priority (Low/Medium/High):", oldPriority);

    if (!newTitle || !newDeadline || !newPriority) {
        alert("Update cancelled or invalid input");
        return;
    }

    const updatedTask = {
        title: newTitle.trim(),
        deadline: newDeadline.trim(),
        priority: newPriority.trim(),
        completed: false
    };

    fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedTask)
    })
    .then(() => {
        loadTasks();
    })
    .catch(err => console.error("Error updating task:", err));
}


// 🔹 Clear input fields
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("priority").value = "";
}


// 🔹 Load tasks on page load
loadTasks();