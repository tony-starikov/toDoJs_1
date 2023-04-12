const tasks = [
  {
    id: "11111",
    completed: false,
    title: "Task 1",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur reprehenderit corrupti molestiae unde, odit eos, assumenda architecto saepe fugiat est ut et quidem facere adipisci quo, sequi perferendis reiciendis provident.",
  },
  {
    id: "22222",
    completed: false,
    title: "Task 2",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur reprehenderit corrupti molestiae unde, odit eos, assumenda architecto saepe fugiat est ut et quidem facere adipisci quo, sequi perferendis reiciendis provident.",
  },
  {
    id: "33333",
    completed: false,
    title: "Task 3",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur reprehenderit corrupti molestiae unde, odit eos, assumenda architecto saepe fugiat est ut et quidem facere adipisci quo, sequi perferendis reiciendis provident.",
  },
  {
    id: "44444",
    completed: false,
    title: "Task 4",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur reprehenderit corrupti molestiae unde, odit eos, assumenda architecto saepe fugiat est ut et quidem facere adipisci quo, sequi perferendis reiciendis provident.",
  },
  {
    id: "55555",
    completed: false,
    title: "Task 5",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur reprehenderit corrupti molestiae unde, odit eos, assumenda architecto saepe fugiat est ut et quidem facere adipisci quo, sequi perferendis reiciendis provident.",
  },
];

(function (arrayOfTasks) {
  const objectOfTasks = arrayOfTasks.reduce((accumulator, task) => {
    accumulator[task.id] = task;
    return accumulator;
  }, {});

  const themes = {
    light: {
      "--bg-color": "#ffc107",
    },
    dark: {
      "--bg-color": "#6c757d",
    },
  };

  // Elements UI
  const tasksContainer = document.querySelector(".tasks-list");
  const form = document.forms["addNewTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const themeCheckbox = document.querySelector("#theme");
  let lastSelectedTheme = localStorage.getItem("app_theme") || "light";

  // Events
  setTheme(lastSelectedTheme);
  renderOfTasks(objectOfTasks);
  form.addEventListener("submit", onFormSubmitHandler);
  tasksContainer.addEventListener("click", onDeleteHandler);
  tasksContainer.addEventListener("click", onDoneHandler);
  themeCheckbox.addEventListener("change", onChangeThemeCheckbox);

  function renderOfTasks(tasksList) {
    if (!tasksList) {
      console.error("Tasks list is empty!");
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.values(tasksList).forEach((task) => {
      const taskRow = taskRowTemplate(task);
      fragment.appendChild(taskRow);
    });

    tasksContainer.appendChild(fragment);
  }

  function taskRowTemplate({ id, title, body } = {}) {
    const row = document.createElement("div");
    row.classList.add("row", "p-5", "pt-0");
    row.setAttribute("data-task-id", id);

    const col = document.createElement("div");
    col.classList.add("col-12", "col-lg-6", "mx-auto");

    const card = document.createElement("div");
    card.classList.add("card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header", "text-center");

    const h2 = document.createElement("h2");
    h2.classList.add("h5", "mb-0");
    h2.textContent = title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const taskBody = document.createElement("p");
    taskBody.classList.add("mb-0");
    taskBody.textContent = body;

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    const doneButton = document.createElement("button");
    doneButton.classList.add("btn", "btn-success");
    doneButton.type = "button";
    doneButton.textContent = "Done";

    const whiteSpace = document.createTextNode("\u00A0");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    cardHeader.appendChild(h2);
    cardBody.appendChild(taskBody);
    cardFooter.appendChild(doneButton);
    cardFooter.appendChild(whiteSpace);
    cardFooter.appendChild(deleteButton);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    col.appendChild(card);

    row.appendChild(col);

    return row;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();

    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Please fill out the form below!");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);

    const newTaskRow = taskRowTemplate(task);

    tasksContainer.insertAdjacentElement("afterbegin", newTaskRow);

    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      id: `task-${Date.now()}`,
      completed: false,
    };

    objectOfTasks[newTask.id] = newTask;

    return { ...newTask };
  }

  function onDeleteHandler(e) {
    if (e.target.classList.contains("btn-danger")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirm = deleteTask(id);
      if (confirm) {
        deleteTaskFromDom(parent);
        // alert('Task deleted!');
      }
    }
  }

  function deleteTask(id) {
    const task = objectOfTasks[id];
    const isConfirmed = confirm(
      `Do you want to delete the task with title: ${task.title} ?`
    );

    if (isConfirmed) {
      delete objectOfTasks[id];
    }

    return isConfirmed;
  }

  function deleteTaskFromDom(element) {
    element.remove();
  }

  function onChangeThemeCheckbox(e) {
    let selectedTheme;
    if (e.target.checked) {
      selectedTheme = "dark";
    } else {
      selectedTheme = "light";
    }

    setTheme(selectedTheme);
    localStorage.setItem("app_theme", selectedTheme);
  }

  function setTheme(name) {
    const selectedThemeObject = themes[name];

    if (name == "dark") {
      themeCheckbox.checked = true;
    } else {
      themeCheckbox.checked = false;
    }

    Object.entries(selectedThemeObject).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  function onDoneHandler(e) {
    if (e.target.classList.contains("btn-success")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const taskText = parent.querySelector("p");
      lineThroughDoneTask(taskText);
      taskDone(id);
    }
  }

  function lineThroughDoneTask(element) {
    element.classList.toggle("text-decoration-line-through");
  }

  function taskDone(id) {
    const task = objectOfTasks[id];
    if (task.completed) {
      task.completed = false;
    } else {
      task.completed = true;
    }
  }
})(tasks);
