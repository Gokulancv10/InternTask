function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let todo = 0; todo < cookies.length; todo++) {
            const cookie = cookies[todo].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

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

$(document).ready(function() {
    var incompleteHome = '/api/todo-incomplete/?incomplete=1';
    var completedHome = '/api/todo-completed/?completed=1';
    todoIncompleteItems(incompleteHome);
    todoCompletedItems(completedHome);
    // Create Todo Item
    $('#addTodobtn').click(function(e) {
        e.preventDefault();
        var title = $('#id_title').val()
        var user_id = $('#welcome').data('id')
        console.log("Title: ", title)
        $.ajax({
            url: 'api/create-todo/',
            type: "POST",
            data: {
                'title': title,
                'user_id': user_id,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(data) {
                console.log("Create Todo Item Success: ", data)
                document.getElementById('incompleteTodo').innerHTML = '';
                todoIncompleteItems(incompleteHome);
            },
            error: function(err) {
                console.log("Create Todo Item Error: ", err)
            }
        })
        $('#id_title').val('');
    })

    var nextUrlI = null;
    var prevUrlI = null;
    var currentPageIncomplete = null;
    $('#nextPageI').click(function() {
        var page = nextUrlI.slice(nextUrlI.length - 1)
        $('#currPageI').html(page)
        todoIncompleteItems(nextUrlI);
    })

    $('#prevPageI').click(function() {
        var page = prevUrlI.slice(prevUrlI.length - 1)
        if (page == '/') {
            page = '1'
        }
        $('#currePageI').html(page)
        todoIncompleteItems(prevUrlI);
    })

    // Page wise Incomplete Todo Items
    function todoIncompleteItems(incompleteUrl) {
        $('#incompleteTodo').html('');
        $.ajax({
            url: incompleteUrl,
            type: 'GET',
            success: function(data) {
                currentPageIncomplete = `api/todo-incomplete/?incomplete=${data.current_page_no}`
                nextUrlI = data.next;
                if (data.next != null) {
                    $('#nextPageI').css("visibility", "visible")

                } else {
                    $('#nextPageI').css("visibility", "hidden")
                }

                prevUrlI = data.previous;
                if (data.previous != null) {
                    $('#prevPageI').css("visibility", "visible")
                } else {
                    $('#prevPageI').css("visibility", "hidden")
                }

                if (data.next === null && data.previous === null) {
                    $('#currentPageIncomplete').css("visibility", "hidden")
                } else {
                    $('#currentPageIncomplete').css("visibility", "vsible")
                }

                var todoItems = data.results
                for (var todo in todoItems) {
                    $('#incompleteTodo').append(
                        `<div class="list-group-item list-group-item-primary mb-1" id="todo-${todo}"
                            data-id="${todoItems[todo].id}">
                            <span class='title'>${todoItems[todo].title}</span>
                            <div class="float-right">
                                <badge type="submit" class="badge badge-warning" id="deleteTodo_${todoItems[todo].id}">
                                    ❌
                                </badge>
                            </div>
                            <div class="float-right">
                                <badge type="submit" class="badge badge-light mr-1"
                                    id="completed-todo_${todoItems[todo].id}">
                                    &#10004;
                                </badge>
                            </div>          
                            <div class="float-right">
                                <badge type="submit" class="badge badge-dark mr-1 edit"
                                data-target="#updateTodoModal_${todoItems[todo].id}" data-toggle="modal">
                                    edit
                                </badge>
                                <div class="modal" id="updateTodoModal_${todoItems[todo].id}" tabindex="-1"
                                    role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Update Todo</h5>
                                                <button type="button" class="close" data-dismiss="modal"
                                                    aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="list-group-item list-group-item-warning">
                                                    <input type="text" id='updateTodoInp_${todoItems[todo].id}'
                                                        size='45' value="${todoItems[todo].title}">
                                                </div>
                                            </div>
                                                <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                                    Close
                                                </button>
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
                                            <input type="text" required id='addTaskInp_${todoItems[todo].id}' size='45'
                                                name="heading" placeholder="Enter the task name here...">
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary closeModal"
                                                    data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="button" class="btn btn-primary"
                                                    id="taskSubmit_${todoItems[todo].id}" data-dismiss="modal">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                        
                            <div class="mt-3 incompleteTodo-task">
                                ${todoItems[todo].tasks ? taskStatus(todoItems[todo].tasks) : ''} 
                            </div>   
                        </div>
                        `
                    )
                };
                for (var todo in todoItems) {
                    var deleteTodoBtn = document.getElementById(`deleteTodo_${todoItems[todo].id}`)
                    var taskSubmitBtn = document.getElementById(`taskSubmit_${todoItems[todo].id}`)
                    var editTodoBtn = document.getElementById(`updateModalSubmit_${todoItems[todo].id}`)
                    var completedTodoBtn = document.getElementById(`completed-todo_${todoItems[todo].id}`)

                    deleteTodoBtn.addEventListener('click', (function(element) {
                        return function() {
                            deleteTodo(element)
                        }
                    })(todoItems[todo]))

                    taskSubmitBtn.addEventListener('click', (function(element) {
                        return function() {
                            addTaskItem(element)
                        }
                    })(todoItems[todo]))

                    editTodoBtn.addEventListener('click', (function(element) {
                        return function() {
                            stateSave: true
                            editTodoItem(element)
                        }
                    })(todoItems[todo]))

                    completedTodoBtn.addEventListener('click', (function(element) {
                        return function() {
                            completedTodo(element)
                        }
                    })(todoItems[todo]))

                    var taskItems = todoItems[todo].tasks
                    for (var task in taskItems) {
                        var deleteTaskBtn = document.getElementById(`delete-task_${taskItems[task].id}`)
                        var completeTaskBtn = document.getElementById(`complete-task_${taskItems[task].id}`)
                        var editTaskBtn = document.getElementById(`updateTaskModalSubmit_${taskItems[task].id}`)

                        deleteTaskBtn.addEventListener('click', (function(element) {
                            return function() {
                                deleteTask(element)
                            }
                        })(taskItems[task]))

                        completeTaskBtn.addEventListener('click', (function(element) {
                            return function() {
                                completedTask(element)
                            }
                        })(taskItems[task]))

                        editTaskBtn.addEventListener('click', (function(element) {
                            return function() {
                                editTaskItem(element)
                            }
                        })(taskItems[task]))
                    }
                }
            },
            error: function(err) {
                console.log(err)
            }
        });
    }

    var nextCompleted = null;
    var prevCompleted = null;
    var currentCompleted = null;
    $('#nextPageC').click(function() {
        var page = nextCompleted.slice(nextCompleted.length - 1)
        $('#currPageC').html(page)
        todoCompletedItems(nextCompleted);
    })

    $('#prevPageC').click(function() {
        var page = prevCompleted.slice(prevCompleted.length - 1)
        if (page === '/') {
            page = 1;
        }
        $('#currPageC').html(page)
        todoCompletedItems(prevCompleted);
    })
    // Page wise Completed Todo Items
    function todoCompletedItems(CompletedUrl) {
        $('#completedTodo').html('');

        $.ajax({
            url: CompletedUrl,
            type: 'GET',
            success: function(data) {
                var todoItems = data.results;
                nextCompleted = data.next;
                prevCompleted = data.previous;
                currentCompleted = `api/todo-completed/?completed=${data.current_page_no}`

                if (data.next != null) {
                    $('#nextPageC').css("visibility", "visible")

                } else {
                    $('#nextPageC').css("visibility", "hidden")
                }

                if (data.previous != null) {
                    $('#prevPageC').css("visibility", "visible")
                } else {
                    $('#prevPageC').css("visibility", "hidden")
                }

                if (data.next === null && data.previous === null) {
                    $('#completedPagination').css("visibility", "hidden")
                } else {
                    $('#completedPagination').css("visibility", "visible")
                }

                for (var todo in todoItems) {
                    $('#completedTodo').append(
                        `
                        <div class="list-group-item list-group-item-info completed-list mb-1"
                            id="todo_${todoItems[todo].id}" data-id="${todoItems[todo].id}">
                            <span class="title">${todoItems[todo].title}</span>
                            <div class="float-right">
                                <badge type="submit" class="badge badge-warning mr-2"
                                    id="deleteTodo_${todoItems[todo].id}">
                                    ❌
                                </badge>
                            </div>
                            <div class="completedTodoTask mt-3">                  
                                ${todoItems[todo].tasks ? taskStatus(todoItems[todo].tasks) : ''}
                            </div>  
                        </div>
                        `
                    )
                }

                for (var todo in todoItems) {
                    var deleteTodoBtn = document.getElementById(`deleteTodo_${todoItems[todo].id}`)

                    deleteTodoBtn.addEventListener('click', (function(item) {
                        return function() {
                            deleteTodo(item)
                        }
                    })(todoItems[todo]))

                    var taskItems = todoItems[todo].tasks
                    for (var task in taskItems) {
                        var deleteTaskBtn = document.getElementById(`delete-task_${taskItems[task].id}`)

                        deleteTaskBtn.addEventListener('click', (function(element) {
                            return function() {
                                deleteTask(element)
                            }
                        })(taskItems[task]))
                    }
                }

            },
            error: function(err) {
                console.log(err)
            }
        })
    }

    function editTodoItem(item) {
        stateSave: true
        var user_id = $('#welcome').data('id');
        var title = $(`#updateTodoInp_${item.id}`).val();
        $.ajax({
            url: `api/update-todo/${item.id}/`,
            type: 'POST',
            data: {
                'title': title,
                'user_id': user_id,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
            },
            error: function(data) {
                console.log('Problem in updating todo item: ', data)
            }
        })
    }

    function addTaskItem(item) {
        var heading = $(`#addTaskInp_${item.id}`).val();
        var user_id = $('#welcome').data('id')
        $.ajax({
            url: 'api/create-task/',
            type: 'POST',
            data: {
                'heading': heading,
                'user': user_id,
                'todo': item.id,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
            },
            error: function(data) {
                console.log('Problem in adding new task item: ', data)
            }
        })
    }

    function completedTodo(item) {
        var user_id = $('#welcome').data('id')
        $.ajax({
            url: `api/completeTodoTask/${item.id}/`,
            type: 'POST',
            data: {
                'title': item.title,
                'user_id': user_id,
                'completed': true,
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
                todoCompletedItems(currentCompleted);
            },
            error: function(data) {
                console.log('Problem in Completing Todo item: ', data)
            }
        })
    }

    function deleteTodo(item) {
        console.log('Delete Todo Button Clicked: ', item.title)
        $.ajax({
            url: `api/delete-todo/${item.id}/`,
            type: 'DELETE',
            headers: {
                "X-CSRFToken": csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
                todoCompletedItems(currentCompleted);
            },
            error: function(data) {
                console.log("There was an error while deleting Todo Item: ", data)
            }
        })
    }


    function editTaskItem(item) {
        var user_id = $('#welcome').data('id');
        var heading = $(`#updateTaskInp_${item.id}`).val();
        $.ajax({
            url: `api/update-task/${item.id}/`,
            type: 'POST',
            data: {
                'heading': heading,
                'user': user_id,
                'todo': item.todo,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
            },
            error: function(err) {
                console.log("There was an error while deleting Task Item: ", data)
            }
        })
    }

    function completedTask(item) {
        var user_id = $('#welcome').data('id')
        $.ajax({
            url: `api/complete-task/${item.id}/`,
            type: 'POST',
            data: {
                'heading': item.heading,
                'user': user_id,
                'completed': true,
                'title': 'title',
                'user_id': user_id,
                'csrfmiddlewaretoken': csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
                todoCompletedItems(currentCompleted);
            },
            error: function(data) {
                console.log('Problem in Completing Task item: ', data)
            }
        })
    }

    function deleteTask(item) {
        console.log("Delete Task Button Clicked: ", item.heading)
        $.ajax({
            url: `api/delete-task/${item.id}/`,
            type: 'DELETE',
            headers: {
                "X-CSRFToken": csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
                todoCompletedItems(currentCompleted);
            },
            error: function(data) {
                console.log("There was an error while deleting Task Item: ", data)
            }
        })
    }

})