const todoForm = document.querySelector(".formTodo") as HTMLFormElement;
const todoInput = document.querySelector(".todo") as HTMLInputElement;
const button = document.querySelector(".btn") as HTMLButtonElement;
const todoList = document.querySelector(".todolist") as HTMLUListElement;

interface TodoInterface {
  todo: string;
  isDone: boolean;
}
interface LocalInterface {
  get(key: string): TodoInterface[] | [];
  set(key: string, value: TodoInterface[]): void;
}

function storageFactory(): LocalInterface {
  return {
    get(key: string) {
      const data: string | null = localStorage.getItem(key);

      return data ? JSON.parse(data) : [];
    },
    set(key: string, value: TodoInterface[]) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
}

const KEY_TODOS = "Todos";
const store = storageFactory();
const todos: TodoInterface[] = store.get(KEY_TODOS);

function renderTodos(todos: TodoInterface[]): void {
  const markup: string = todos
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

function handleTodoDone(event: Event): void {
  const targetElement = event.target as HTMLElement;
  const checkDone = targetElement.closest(".tododone") as HTMLInputElement;

  if (!checkDone) return;

  const datasetId: string | undefined = checkDone.dataset.id;

  if (datasetId) {
    const id: number = Number.parseInt(datasetId);

    todos.forEach((todo, index) => {
      if (index === id) {
        todo.isDone = !todo.isDone;
      }
    });

    renderTodos(todos);
    store.set(KEY_TODOS, todos);
  }
}

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();

  const todoText: string | undefined = todoInput.value;

  if (!todoText) return;

  todos.push({ todo: todoText, isDone: false });
  todoInput.value = "";
  renderTodos(todos);
  store.set(KEY_TODOS, todos);
}

todoForm.addEventListener("submit", handleSubmit);
todoList.addEventListener("click", handleTodoDone);

function init(): void {
  renderTodos(todos);
}

init();
