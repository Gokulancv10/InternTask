from django import forms
from django.forms import ModelForm

from .models import *

from django.contrib.auth.forms import User
from django.contrib.auth.forms import UserCreationForm

class TodoForm(forms.ModelForm):

	class Meta:

		model = Todo
		fields = ['title']



class userRegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username','email','password1','password2']


		