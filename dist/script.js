"use strict";
const todoForm = document.querySelector(".formTodo");
const todoInput = document.querySelector(".todo");
const button = document.querySelector(".btn");
const todoList = document.querySelector(".todolist");
function storageFactory() {
    return {
        get(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
    };
}
const KEY_TODOS = "Todos";
const store = storageFactory();
const todos = store.get(KEY_TODOS);
function renderTodos(todos) {
    const markup = todos
        .map((todo, index) => {
        return `
        <li>
          <span>${todo.todo}</span>
          <input
            type="checkbox"
            class="tododone" ${todo.isDone ? "checked" : ""}
            data-id="${index}"  
          />
        </li>
      `;
    })
        .join("");
    todoList.innerHTML = "";
    todoList.insertAdjacentHTML("afterbegin", markup);
}
function handleTodoDone(event) {
    const targetElement = event.target;
    const checkDone = targetElement.closest(".tododone");
    if (!checkDone)
        return;
    const datasetId = checkDone.dataset.id;
    if (datasetId) {
        const id = Number.parseInt(datasetId);
        todos.forEach((todo, index) => {
            if (index === id) {
                todo.isDone = !todo.isDone;
            }
        });
        renderTodos(todos);
        store.set(KEY_TODOS, todos);
    }
}
function handleSubmit(event) {
    event.preventDefault();
    const todoText = todoInput.value;
    if (!todoText)
        return;
    todos.push({ todo: todoText, isDone: false });
    todoInput.value = "";
    renderTodos(todos);
    store.set(KEY_TODOS, todos);
}
todoForm.addEventListener("submit", handleSubmit);
todoList.addEventListener("click", handleTodoDone);
function init() {
    renderTodos(todos);
}
init();
