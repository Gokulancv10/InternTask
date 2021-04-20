from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path('', views.list, name='home'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='todo/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(
        template_name='todo/logout.html'), name='logout'),

    # All API urls
    path('api/', views.apiOverview, name="apiOverview"),

    # API for Todo items
    path('api/todo-list/', views.todoList, name='todoListAPI'),
    path('api/todo-list-incomplete/', views.todoListIncomplete,
         name='todoListIncompletedAPI'),
    path('api/todo-list-completed/', views.todoListCompleted,
         name='todoListCompletedAPI'),
    path('api/todo-list/<int:todo_id>/',
         views.todoListView, name="todoListViewAPI"),
    path('api/create-todo/', views.createTodo, name="createTodoAPI"),
    path('api/update-todo/<int:todo_id>/',
         views.updateTodo, name="todoUpdateAPI"),
    path('api/delete-todo/<int:todo_id>/',
         views.deleteTodo, name="todoDeleteAPI"),
    path('api/completeTodoTask/<int:todo_id>/', views.completeTodoTask),
    path('api/complete-task/<int:task_id>/', views.completeTask),

    # API for Task items
    path('api/task-list/', views.taskList, name='taskListAPI'),
    path('api/task-list/<int:task_id>/',
         views.taskListView, name="taskListViewAPI"),
    path('api/create-task/', views.createTask, name="createTaskAPI"),
    path('api/update-task/<int:task_id>/',
         views.updateTask, name="taskUpdateAPI"),
    path('api/delete-task/<int:task_id>/',
         views.deleteTask, name="taskDeleteAPI"),

    # API - Incomplete Todo Items for Pagination
    path('api/todo-incomplete/', views.todoIncomplete, name='todoIncomplete'),
    # API - Completed Todo Items for Pagination 
    path('api/todo-completed/', views.todoCompleted, name='todoIncomplete')
]
