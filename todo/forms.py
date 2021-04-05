from django import forms
from django.forms import ModelForm
from django.contrib.auth.forms import User
from django.contrib.auth.forms import UserCreationForm

from .models import Todo, Task


class TodoForm(forms.ModelForm):

    class Meta:
        model = Todo
        fields = ['title', 'completed']


class TaskForm(forms.ModelForm):

    class Meta:
        model = Task
        fields = ['heading', 'todo']


class UserRegisterForm(UserCreationForm):

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
