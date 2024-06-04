document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const todoForm = document.getElementById('todoForm');
    const todoList = document.getElementById('todoList');
    const userEmailDisplay = document.getElementById('userEmail');
    const logoutButton = document.getElementById('logoutButton');
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    function generateUID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function displayTodos() {
        todoList.innerHTML = '';
        const userTodos = todos.filter(todo => todo.user_id === currentUser.uid);
        userTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<span>${todo.title} - ${todo.description} (${todo.date})</span> <button class="btn btn-danger btn-sm" onclick="deleteTodo('${todo.id}')">Delete</button>`;
            todoList.appendChild(li);
        });
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        localStorage.setItem('todos', JSON.stringify(todos));
        displayTodos();
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
        setTimeout(() => alertDiv.remove(), 3000);
    }

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (users.find(user => user.email === email)) {
            showAlert('User already exists!', 'danger');
            return;
        }

        const newUser = {
            email,
            password,
            uid: generateUID(),
            status: 'active',
            createdAt: new Date()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        showAlert('Registration successful!', 'success');
        registrationForm.reset();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            showAlert('Invalid credentials!', 'danger');
            return;
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAlert('Login successful!', 'success');
        userEmailDisplay.textContent = currentUser.email;
        loginForm.reset();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('todo-management').style.display = 'block';
        displayTodos();
    });

    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('todoTitle').value;
        const description = document.getElementById('todoDescription').value;
        const date = document.getElementById('todoDate').value;

        const newTodo = {
            title,
            description,
            date,
            id: generateUID(),
            status: 'pending',
            createdAt: new Date(),
            user_id: currentUser.uid
        };

        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        showAlert('To-Do added successfully!', 'success');
        todoForm.reset();
        displayTodos();
    });

    logoutButton.addEventListener('click', function () {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('todo-management').style.display = 'none';
        showAlert('Logged out successfully!', 'success');
    });

    if (currentUser) {
        userEmailDisplay.textContent = currentUser.email;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('todo-management').style.display = 'block';
        displayTodos();
    }
});
