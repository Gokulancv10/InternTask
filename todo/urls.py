from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path('', views.Home.as_view(), name='home'),
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='todo/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(
        template_name='todo/logout.html'), name='logout'),
    # All API urls
    path('api/', views.APIOverView.as_view()),
    path('api/todo/<int:todo_id>/', views.TodoItem.as_view()),
    path('api/task/<int:task_id>/', views.TaskItem.as_view()),
    # Create Todo Item
    path('api/create-todo/', views.CreateTodo.as_view()),
    # Create Task Item
    path('api/create-task/', views.CreateTask.as_view()),
    path('api/completeTodo/<int:todo_id>/', views.CompleteTodoItem.as_view()),
    path('api/completeTask/<int:task_id>/', views.CompleteTaskItem.as_view()),
    # API - Incomplete Todo Items for Pagination
    path("api/todo-incomplete/", views.TodoIncompletePagination.as_view(),
         name="todo-incomplete"),
    # API - Completed Todo Items for Pagination
    path("api/todo-completed/", views.TodoCompletedPagination.as_view()),
]
