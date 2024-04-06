// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id

function generateTaskId() {
  let id = new Date().getTime();
  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $(
    `<div class="card draggable my-3" data-project-id="${task.id}"></div>`
  );
  const taskHeader = $(
    `<div class="card-header"><h4 class="card-title">${task.title}</h4></div>`
  );
  const taskBody = $(`<div class="card-body"></div>`);
  const taskDescription = $(`<p class="card-text">${task.description}</p>`);
  const taskDueDate = $(`<p class="card-text">${task.dueDate}</p>`);
  const taskButton = $(
    `<button class="btn btn-danger delete" data-project-id="${task.id}">Delete</button>`
  );

const now = dayjs();
    if(now.isSame(task.dueDate, 'day')){
      taskCard.addClass('bg-warning text-white');
    } else if(now.isAfter(task.dueDate, 'day')){
      taskCard.addClass('bg-danger text-white');
      taskButton.addClass('border-light');
    }

  taskCard.append(taskHeader);
  taskCard.append(taskBody);
  taskBody.append(taskDescription);
  taskBody.append(taskDueDate);
  taskBody.append(taskButton);
  $('#todo-cards').append(taskCard);
  // return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if(!taskList){
      return [];
    } else{
      for (const task of taskList) {
        createTaskCard(task);
      }
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $("#taskTitle");
  const taskDueDate = $("#taskDueDate");
  const taskDescription = $("#taskDescription");

  const newTask = {
    // ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
    id: generateTaskId(),
    title: taskTitle.val(),
    description: taskDescription.val(),
    dueDate: taskDueDate.val(),
  };
  
  let tasks;
  if(!taskList){
    tasks = [];
  } else{
    tasks = taskList;
  }
  
  tasks.push(newTask);
  
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskTitle.val('');
  taskDueDate.val('');
  taskDescription.val('');

  $('#formModal').modal('hide');
  
  createTaskCard(newTask);

  

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const cardContainer = event.target.parentElement.parentElement;
  console.log(parent);
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render task list
  renderTaskList();

  // Event Listener
  $("#newTaskButton").on("click", handleAddTask);
  // Add event listener to handleDeleteTask
  $(".delete").on("click", handleDeleteTask);

  // Due Date datepicker
  $("#taskDueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});
