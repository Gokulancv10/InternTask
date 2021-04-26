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
            `
            <div class="card list-group-item list-group-item-danger mt-1" id="task_${task.id}">
                <span class="font-italic">${task.heading}</span>
                <div class="float-right">
                    <badge type="submit" class="badge badge-light" id="complete-task_${task.id}">
                        &#10004;
                    </badge>
                    <badge type="submit" class="badge badge-warning ml-1" id="delete-task_${task.id}">
                        ❌
                    </badge>
                </div>
                <div class="float-right">
                    <badge type="submit"
                            class="badge badge-dark mr-1 edit-task"
                            id="edit-task_${task.id}"
                            data-target="#updateTaskModal_${task.id}"
                            data-toggle="modal">
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
                                        <input type="text" required id='updateTaskInp_${task.id}' size='50'
                                            name="heading_${task.id}" value="${task.heading}">
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
                
        ).join('')}
    `
};

function taskCompleted(item) {
    return `
        ${item.map(task => 
            `
            <div class="list-group-item bg-danger mb-1">
                <span class="text-light font-italic">${task.heading}</span>
                <div class="float-right">
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
    const incompleteHome = '/api/todo-incomplete/?incomplete=1';
    const completedHome = '/api/todo-completed/?completed=1';
    todoIncompleteItems(incompleteHome);
    todoCompletedItems(completedHome);
    // Create Todo Item
    $('#addTodobtn').click(function(e) {
        e.preventDefault();
        var title = $(".title-input").val();
        var user_id = $('#welcome').data('id');
        console.log("Title: ", title)
        $.ajax({
            url: "api/create-todo/",
            type: "POST",
            data: {
                "title": title,
                "user_id": user_id,
                "csrfmiddlewaretoken": csrftoken,
            },
            success: function(data) {
                $("#incompleteTodo").html('');
                todoIncompleteItems(incompleteHome);
            },
            error: function(err) {
                alert("check the console for errors");
                console.log("Create Todo Item Error: ", err)
            }
        })
        $(".title-input").val('');
    })

    var nextIncomplete = null;
    var prevIncomplete = null;
    var currentPageIncomplete = null;
    var currentIncomplete = null;

    $('#nextPageI').click(function() {
        currentIncomplete +=1
        $('#currPageI').html(currentIncomplete)
        todoIncompleteItems(nextIncomplete);
    })

    $('#prevPageI').click(function() {
        currentIncomplete -= 1
        $('#currPageI').html(currentIncomplete)
        todoIncompleteItems(prevIncomplete);
    })

    // Page wise Incomplete Todo Items
    function todoIncompleteItems(incompleteUrl) {
        $('#incompleteTodo').html('');
        $.ajax({
            url: incompleteUrl,
            type: 'GET',
            data:{
                "csrfmiddlewaretoken": csrftoken
            },
            success: function(data) {
                currentPageIncomplete = `api/todo-incomplete/?incomplete=${data.current_page_no}`;
                currentIncomplete = data.current_page_no;

                nextIncomplete = data.next;
                if (data.next != null) {
                    $('#nextPageI').css("visibility", "visible")

                } else {
                    $('#nextPageI').css("visibility", "hidden")
                }

                prevIncomplete = data.previous;
                if (data.previous != null) {
                    $('#prevPageI').css("visibility", "visible")
                } else {
                    $('#prevPageI').css("visibility", "hidden")
                }

                if (data.next === null && data.previous === null) {
                    $('#incompletePagination').css("visibility", "hidden")
                } else {
                    $('#incompletePagination').css("visibility", "vidible")
                }

                let todoItems = data.results;
                for (let todo in todoItems) {
                    $('#incompleteTodo').append(
                        `<div class="list-group-item list-group-item-primary mb-1" id="todo-${todo}"
                            data-id="${todoItems[todo].id}">
                            <span class="font-weight-bold">${todoItems[todo].title}</span>
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
                                                        size="50" value="${todoItems[todo].title}">
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
                                                <div class="list-group-item list-group-item-dark">
                                                    <input type="text" required id='addTaskInp_${todoItems[todo].id}' size="50"
                                                        name="heading" placeholder="Enter the task name here...">
                                                </div>  
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
                    var deleteTodoBtn = document.querySelector(`#deleteTodo_${todoItems[todo].id}`)
                    var taskSubmitBtn = document.querySelector(`#taskSubmit_${todoItems[todo].id}`)
                    var editTodoBtn = document.querySelector(`#updateModalSubmit_${todoItems[todo].id}`)
                    var completedTodoBtn = document.querySelector(`#completed-todo_${todoItems[todo].id}`)

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
                        var deleteTaskBtn = document.querySelector(`#delete-task_${taskItems[task].id}`)
                        var completeTaskBtn = document.querySelector(`#complete-task_${taskItems[task].id}`)
                        var editTaskBtn = document.querySelector(`#updateTaskModalSubmit_${taskItems[task].id}`)

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

                        if(taskItems[task].completed === true) {
                            $(`#task_${taskItems[task].id}`).removeClass("list-group-item-danger")
                            $(`#task_${taskItems[task].id}`).addClass("list-group-item-dark")
                            $(`#edit-task_${taskItems[task].id}`).remove()
                            $(`#complete-task_${taskItems[task].id}`).remove()
                        }
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
    var currentPageCompleted = null;
    var currentCompleted = null;
    $('#nextPageC').click(function() {
        currentCompleted +=1
        $('#currPageC').html(currentCompleted)
        todoCompletedItems(nextCompleted);
    })

    $('#prevPageC').click(function() {
        currentCompleted -=1
        $('#currPageC').html(currentCompleted)
        todoCompletedItems(prevCompleted);
    })
    // Page wise Completed Todo Items
    function todoCompletedItems(CompletedUrl) {
        $('#completedTodo').html('');
        $.ajax({
            url: CompletedUrl,
            type: 'GET',
            data:{
                "csrfmiddlewaretoken": csrftoken
            },
            success: function(data) {
                var todoItems = data.results;  
                currentPageCompleted = `api/todo-completed/?completed=${data.current_page_no}`
                currentCompleted = data.current_page_no

                nextCompleted = data.next;
                if (data.next != null) {
                    $('#nextPageC').css("visibility", "visible")

                } else {
                    $('#nextPageC').css("visibility", "hidden")
                }

                prevCompleted = data.previous;
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
                        <div class="list-group-item bg-success mb-1"
                            id="todo_${todoItems[todo].id}" data-id="${todoItems[todo].id}">
                            <span class="text-light font-weight-bold">${todoItems[todo].title}</span>
                            <div class="float-right">
                                <badge type="submit" class="badge badge-warning mr-2"
                                    id="deleteTodo_${todoItems[todo].id}">
                                    ❌
                                </badge>
                            </div>
                            <div class="completedTodoTask mt-3">                  
                                ${todoItems[todo].tasks ? taskCompleted(todoItems[todo].tasks) : ''}
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
                console.log(err);
            }
        })
    }

    function editTodoItem(item) {
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
                alert("check the console for errors")
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
                alert("check the console for errors")
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
                todoCompletedItems(completedHome);
            },
            error: function(data) {
                alert("check the console for errors")
                console.log('Problem in Completing Todo item: ', data)
            }
        })
    }

    function deleteTodo(item) {
        $.ajax({
            url: `api/delete-todo/${item.id}/`,
            type: 'DELETE',
            headers: {
                "X-CSRFToken": csrftoken,
            },
            success: function(data) {
                todoIncompleteItems(currentPageIncomplete);
                todoCompletedItems(currentPageCompleted);
            },
            error: function(data) {
                alert("check the console for errors")
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
                alert("check the console for errors")
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
                todoCompletedItems(completedHome);
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
                todoCompletedItems(currentPageCompleted);
            },
            error: function(data) {
                alert("check the console for errors")
                console.log("There was an error while deleting Task Item: ", data)
            }
        })
    }

})