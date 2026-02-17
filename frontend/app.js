const API_URL = 'http://localhost:8080/api/tasks';

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasksList').innerHTML = '<p class="error">Failed to load tasks. Please try again.</p>';
    }
}

// Display tasks on UI
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="loading">No tasks yet. Add one to get started!</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleTask(${task.id}, ${!task.completed})">
                    ${task.completed ? '✓ Done' : 'Mark Done'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new task
async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDesc').value.trim();

    if (!title) {
        alert('Please enter a task title!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });

        if (response.ok) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDesc').value = '';
            loadTasks();
        } else {
            alert('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Error adding task. Please try again.');
    }
}

// Toggle task completion
async function toggleTask(id, completed) {
    try {
        const tasksList = document.getElementById('tasksList');
        const currentTask = Array.from(tasksList.querySelectorAll('.task-item')).find(el => 
            el.querySelector('.btn-complete').onclick.toString().includes(id)
        );
        
        if (!currentTask) {
            loadTasks();
            return;
        }

        const title = currentTask.querySelector('.task-title').textContent;
        const description = currentTask.querySelector('.task-desc')?.textContent || '';

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: completed
            })
        });

        if (response.ok) {
            loadTasks();
        } else {
            alert('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task. Please try again.');
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTasks();
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
