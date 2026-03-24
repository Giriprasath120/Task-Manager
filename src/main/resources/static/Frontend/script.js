const BASE_URL = "http://localhost:8080/tasks";

// 🔹 Load all tasks
function loadTasks() {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
        let output = "";

        data.forEach(task => {

            // 🎨 Priority color (UI upgrade)
            let priorityColor = "black";
            if (task.priority === "High") priorityColor = "red";
            else if (task.priority === "Medium") priorityColor = "orange";
            else if (task.priority === "Low") priorityColor = "green";

            output += `
                <div class="task">
                    <h3>${task.title}</h3>
                    <p>${task.deadline} | 
                        <span style="color:${priorityColor}; font-weight:bold;">
                            ${task.priority}
                        </span>
                    </p>

                    <button class="edit-btn"
                        onclick="editTask(${task.id}, '${task.title}', '${task.deadline}', '${task.priority}')">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteTask(${task.id})">
                        Delete
                    </button>
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
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

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
        alert("Task deleted!");
        loadTasks();
    })
    .catch(err => console.error("Error deleting task:", err));
}


// 🔹 Edit task (prompt version - simple UX)
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
        alert("Task updated!");
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