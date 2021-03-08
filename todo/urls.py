from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.conf import settings

urlpatterns = [
 	path('', views.home, name='home'),	
    path('update_todo/<int:pk>/', views.update_todo, name='update_todo'),
    path('completed/<int:pk>/', views.completed_todo, name="completed_todo"),
    path('delete_todo/<int:pk>/', views.delete_todo, name='delete_todo'),
    path('add_task/<int:pk>/', views.add_task, name='addTask'),
	path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='todo/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='todo/logout.html'), name='logout'),
]