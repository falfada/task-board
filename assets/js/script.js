// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const swimLanes = $('.swim-lanes');

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

  return taskCard;

  

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  
    if(!taskList){
      return [];
    } else{
      for (const task of taskList) {
        const taskCard = createTaskCard(task);
        if(task.status === 'to-do'){
          $('#todo-cards').append(taskCard);
        } else if(task.status === 'in-progress'){
          $('#in-progress-cards').append(taskCard);
        } else if(task.status === 'done'){
          $('#done-cards').append(taskCard);
        }
      }

    }

    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
    
      helper: function (e) {
        
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $("#taskTitle");
  const taskDueDate = $("#taskDueDate");
  const taskDescription = $("#taskDescription");

  const newTask = {
    id: generateTaskId(),
    title: taskTitle.val(),
    description: taskDescription.val(),
    dueDate: taskDueDate.val(),
    status: 'to-do',
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
  
  renderTaskList();

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();

  const cardId = parseInt($(this).attr('data-project-id'));
  const tasks = taskList;

  for (let i = 0; i < tasks.length; i++) {
    const card = tasks[i];
    if(card.id === cardId){
      tasks.splice(i, 1);
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));

  $(this).parent().parent().remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // console.log(event.target.id);

  const taskId = parseInt(ui.draggable[0].dataset.projectId);
  const newStatus = event.target.id;

  for(let task of taskList){
    if(task.id === taskId){
      task.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
  
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render task list
  renderTaskList();

  // Event Listener
  $("#newTaskButton").on("click", handleAddTask);
  $(swimLanes).on("click", ".delete", handleDeleteTask);

  // Due Date datepicker
  $("#taskDueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Lanes Droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});
