function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

var homeUrl = "http://127.0.0.1:8000/api/todo-incomplete/"
var urlh = "http://127.0.0.1:8000/api/todo-incomplete/?incomplete=1";
TodolistIncomplete(urlh)
function TodolistIncomplete(url) {
    var incomplete = document.getElementById('incompleteTodo');
    incomplete.innerHTML = '';

    fetch(url)
        .then((response) => response.json())
        .then(function(data) {          
            
            var todoItems = data.results;
            for (var todo in todoItems) {
                var t = todoItems[todo].tasks;
                var info = 
                    `<div class="list-group-item list-group-item-primary mb-1 flex-wrap" id="todo-${todo}"
                        data-id="${todoItems[todo].id}" name="todo_${todoItems[todo].id}">
                        <span class='title'>${todoItems[todo].title}</span>
                        <div class="float-right">
                            <badge type="submit" class="badge badge-warning" id="delete-todo_${todoItems[todo].id}">
                                ❌
                            </badge>
                        </div>
                        <div class="float-right">
                            <badge type="submit" class="badge badge-light mr-1" id="completed-todo_${todoItems[todo].id}">
                                &#10004;
                            </badge>
                        </div>          
                        <div class="float-right">
                            <badge type="submit" class="badge badge-dark mr-1 edit"
                            data-target="#updateTodoModal_${todoItems[todo].id}" data-toggle="modal">
                                edit
                            </badge>

                            <div class="modal" id="updateTodoModal_${todoItems[todo].id}" tabindex="-1" role="dialog"
                                    aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Update Todo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="list-group-item list-group-item-warning">
                                                <input type="text" required id='updateTodo_${todoItems[todo].id}' size='45' 
                                                name="title_${todoItems[todo].id}" value="${todoItems[todo].title}">
                                            </div>
                                        </div>
                                            <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary"
                                                id="updateModalSubmit_${todoItems[todo].id}" data-dismiss="modal">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="float-right mr-1">
                            <badge type="submit" class="badge badge-primary add-task" data-toggle="modal" 
                                data-target="#addTaskModal_${todoItems[todo].id}">
                                &#x271A;
                            </badge>

                            <div class="modal" id="addTaskModal_${todoItems[todo].id}" tabindex="-1" role="dialog"
                                aria-labelledby="taskModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="taskModalLabel">
                                                Add New Task for ${todoItems[todo].title}
                                            </h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                        <input type="text" required id='addTaskInp_${todoItems[todo].id}' size='40' name="heading"
                                            placeholder="Enter the task name here...">
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary closeModal" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" id="taskSubmit_${todoItems[todo].id}"
                                                data-dismiss="modal">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                        <div class="mt-3 flex-wrap incompleteTodo-task">
                            ${todoItems[todo].tasks ? taskStatus(todoItems[todo].tasks) : ''}  
                        </div>   
                    </div>
                    `
                incomplete.innerHTML += info;
            };

            for (var todo in todoItems){
                var editTodoBtn = document.getElementById(`updateModalSubmit_${todoItems[todo].id}`)
                var completedTodoBtn = document.getElementById(`completed-todo_${todoItems[todo].id}`)
                var deleteTodoBtn = document.getElementById(`delete-todo_${todoItems[todo].id}`)
                var taskSubmitBtn = document.getElementById(`taskSubmit_${todoItems[todo].id}`)

                editTodoBtn.addEventListener('click', (function(element){
                    return function(){
                        editTodoItem(element)
                    }                  
                })(todoItems[todo]))

                taskSubmitBtn.addEventListener('click', (function(element){
                    return function(){
                        addTaskItem(element)
                    }
                })(todoItems[todo]))

                completedTodoBtn.addEventListener('click', (function(element){
                    return function(){
                        completedTodo(element)
                    }
                })(todoItems[todo]))

                deleteTodoBtn.addEventListener('click', (function(element){
                    return function(){
                        deleteTodo(element)
                    }
                })(todoItems[todo]))

                var a = todoItems[todo].tasks
                for (var t in a){
                    var deleteTaskBtn = document.getElementById(`delete-task_${a[t].id}`)
                    var completeTaskBtn = document.getElementById(`complete-task_${a[t].id}`)
                    var editTaskBtn = document.getElementById(`updateTaskModalSubmit_${a[t].id}`)

                    deleteTaskBtn.addEventListener('click', (function(element){
                        return function(){
                            deleteTask(element)
                        }
                    })(a[t]))
                  
                    completeTaskBtn.addEventListener('click', (function(element){
                        return function(){
                            completedTask(element)
                        }
                    })(a[t]))

                    editTaskBtn.addEventListener('click', (function(element){
                        return function(){
                            editTaskItem(element)
                        }
                    })(a[t]))
                }             
            };

        });

    function taskStatus(item) {
        return `
            ${item.map(task =>
                `${task.completed==false ? 
                    `
                    <div class="card list-group-item list-group-item-danger mt-1 flex-wrap" >
                        <span class='heading'>${task.heading}</span>
                        <div class="float-right">
                            <badge type="submit" class="badge badge-light" id="complete-task_${task.id}">
                                &#10004;
                            </badge>
                            <badge type="submit" class="badge badge-warning ml-1" id="delete-task_${task.id}">
                                ❌
                            </badge>
                        </div>
                        <div class='float-right'>
                            <badge type="submit" class="badge badge-dark mr-1 edit-task"
                            data-target="#updateTaskModal_${task.id}" data-toggle="modal">
                                edit
                            </badge>

                            <div class="modal fade" id="updateTaskModal_${task.id}" tabindex="-1" role="dialog"
                                    aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Update Todo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="list-group-item list-group-item-warning">
                                                <input type="text" required id='updateTaskInp_${task.id}' size='45' name="heading_${task.id}"
                                                value="${task.heading}">
                                            </div>
                                        </div>
                                            <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" id="updateTaskModalSubmit_${task.id}"
                                                data-dismiss="modal">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    :
                    `
                    <div class="list-group-item list-group-item-dark flex-wrap mt-1">
                        <span class='heading'>${task.heading}</span>
                        <div class='float-right'>
                            <badge type="submit" class="badge badge-warning" id="delete-task_${task.id}">
                                ❌
                            </badge>
                        </div>
                    </div>`
                }` 
            ).join('')}
        `
    };
};

TodolistCompleted()
function TodolistCompleted() {
    var todoListCompletedAPI = 'http://127.0.0.1:8000/api/todo-completed/';
    var completed = document.getElementById('completedTodo');
    completed.innerHTML = '';

    fetch(todoListCompletedAPI)
        .then((response) => response.json())
        .then(function(data) {

            var todoItems = data.results;
            for (var todo in todoItems) {
                var t = todoItems[todo].tasks;
                var info = 
                    `<div class="list-group-item list-group-item-info completed-list mb-1 flex-wrap" id="todo_${todoItems[todo].id}"
                        data-id="${todoItems[todo].id}" name="todo_${todoItems[todo].id}">
                        <span class='title'>${todoItems[todo].title}</span>
                        <div class="float-right">
                            <badge type="submit" class="badge badge-warning mr-2" id="delete-todo_${todoItems[todo].id}">
                                ❌
                            </badge>
                        </div>
                        <div class="card mt-3 flex-wrap completedTodoTask">                  
                            ${todoItems[todo].tasks ? taskCompleted(todoItems[todo].tasks) : ''}
                        </div>  
                    </div>`
                completed.innerHTML += info;

            };
            for (var todo in todoItems){
                var deleteTodoBtn = document.getElementById(`delete-todo_${todoItems[todo].id}`)
                deleteTodoBtn.addEventListener('click', (function(element){
                    return function(){
                        deleteTodo(element)
                    }
                })(todoItems[todo]))

                var a = todoItems[todo].tasks
                for (var t in a){
                    var deleteTaskBtn = document.getElementById(`delete-task_${a[t].id}`)
                    deleteTaskBtn.addEventListener('click', (function(element){
                        return function(){
                            deleteTask(element)
                        }
                    })(a[t]))
                }
            };
        });

    function taskCompleted(item) {
        return `
            ${item.map(task => 
                `
                <div class="list-group-item list-group-item-warning mb-1">
                    <span class='heading'>${task.heading}</span>
                    <div class='float-right'>
                        <badge type="submit" class="badge badge-warning ml-1" id="delete-task_${task.id}">
                            ❌
                        </badge>
                    </div>
                </div>
                ` 
            ).join('')}
        `
    };
};

var addTodoBtn = document.getElementById('addTodobtn');
addTodoBtn.addEventListener('click', function(e){
    e.preventDefault();
    var url = 'http://127.0.0.1:8000/api/create-todo/'
    var title = document.getElementById('id_title').value
    var user_id = $('#welcome').data('id')
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':title, 'user_id':user_id})
    }).then(function(response){
        $('#id_title').val('');
        TodolistIncomplete(homeUrl);
    });
});

function editTodoItem(item){
    console.log('Update Todo Clicked: ', item)
    var url = `http://127.0.0.1:8000/api/update-todo/${item.id}/`
    var user_id = $('#welcome').data('id');
    var title = document.getElementById(`updateTodo_${item.id}`).value;
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':title, 'user_id':user_id})
    }).then((response)=>{
        TodolistIncomplete(homeUrl);
        console.log('response: ', response)
    })
}

function editTaskItem(item){
    console.log('Update Task Clicked: ', item)
    var url = `http://127.0.0.1:8000/api/update-task/${item.id}/`
    var user_id = $('#welcome').data('id');
    var heading = document.getElementById(`updateTaskInp_${item.id}`).value;
    console.log(heading)
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'heading':heading, 'user':user_id, 'todo':item.todo,
                             'user_id':user_id, 'title':'title'})
    }).then(function(response){
        TodolistIncomplete(homeUrl);
    })
}

function deleteTodo(item){
    console.log('Item Deleted', item.title)
    fetch(`http://127.0.0.1:8000/api/delete-todo/${item.id}`, {
        method:'DELETE',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
    }).then(function(response){
        TodolistIncomplete(homeUrl);
        TodolistCompleted();
    })
}

function completedTodo(item){
    console.log('Completed Todo Clicked', item.title)
    var user_id = $('#welcome').data('id')
    item.completed =!item.completed
    fetch(`http://127.0.0.1:8000/api/complete-todo-task/${item.id}/`, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':item.title, 'user_id':user_id,
                             'completed':item.completed})
    }).then(function(response) {
        TodolistIncomplete(homeUrl);
        TodolistCompleted();
    })
}

function completedTask(item){
    console.log('Completed Task Clicked', item.heading)
    var user_id = $('#welcome').data('id')
    item.completed =!item.completed
    fetch(`http://127.0.0.1:8000/api/complete-task/${item.id}/`, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'heading':item.heading, 'user':user_id, 
            'completed':true, 'todo':item.todo, 'user_id':user_id, 'title':'title'})
    }).then(function(response) {
        TodolistIncomplete(homeUrl);
        TodolistCompleted();
    })
}

function addTaskItem(item){
    console.log('Add New Task Clicked:', item)
    var heading = document.getElementById(`addTaskInp_${item.id}`).value;
    var user_id = $('#welcome').data('id')
    var url = 'http://127.0.0.1:8000/api/create-task/';
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'heading':heading, 'user':user_id, 'todo':item.id,
                             'user_id':user_id, 'title':'title'})
    }).then(function(response){
        TodolistIncomplete(homeUrl);
    })
}

function deleteTask(item){
    console.log('Delete Task Clicked: ', item.heading)
    var url = `http://127.0.0.1:8000/api/delete-task/${item.id}`
    console.log(url)
    fetch(url, {
        method:'DELETE',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
    }).then(function(response) {
        TodolistCompleted(homeUrl);
        TodolistIncomplete();
    })
}