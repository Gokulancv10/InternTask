from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('update_todo/<int:todo_id>/', views.update_todo, name='update_todo'),
    path('update_task/<int:task_id>/', views.update_task, name='update_task'),
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
]
