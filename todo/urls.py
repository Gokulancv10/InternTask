from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('update_todo/<int:todo_id>/', views.update_todo, name='update_todo'),
    path('completed_todo/<int:todo_id>/',
         views.completed_todo, name="completed_todo"),
    path('completed_task/<int:task_id>/',
         views.completed_task, name="completed_task"),
    path('delete_todo/<int:todo_id>/', views.delete_todo, name='delete_todo'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('add_task/<int:task_id>/', views.add_task, name='addTask'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='todo/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(
        template_name='todo/logout.html'), name='logout'),

    # API for Todo items
    path('api/todo-list/', views.todoList, name='todoListAPI'),
    path('api/todo-list/<int:todo_id>/',
         views.todoListView, name="todoListViewAPI"),
    path('api/create-todo/', views.createTodo, name="createTodoAPI"),
    path('api/update-todo/<int:todo_id>/',
         views.updateTodo, name="todoUpdateAPI"),
    path('api/delete-todo/<int:todo_id>/',
         views.deleteTodo, name="todoDeleteAPI"),

    # API for Task items
    path('api/task-list/', views.taskList, name='taskListAPI'),
    path('api/task-list/<int:task_id>/',
         views.taskListView, name="taskListViewAPI"),
    path('api/create-task/', views.createTask, name="createTaskAPI"),
    path('api/update-task/<int:task_id>/',
         views.updateTask, name="taskUpdateAPI"),
    path('api/delete-task/<int:task_id>/',
         views.deleteTask, name="taskDeleteAPI"),
]
