from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Todo
from .forms import TodoForm
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_protect
from .forms import userRegisterForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User

def register(request):
    form = userRegisterForm()

    if request.method =='POST':
        form = userRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password2')

            messages.success(request, f'Your Account Has Been Created!')
     
            return redirect('login')
    else:
        form = userRegisterForm()

    context = {'form':form}
    return render(request, 'todo/register.html', context)


def logoutUser(request):
	logout(request)
	return redirect('login')

@csrf_protect
@login_required(login_url='login')
def home(request):

    todo_form = TodoForm()
    
    comp_upcoming = Todo.objects.filter(completed=True)

    user = request.user

    todo_items = Todo.objects.filter(user_id=user).order_by('-date_created')

    context = {'todo_items':todo_items,'comp_upcoming':comp_upcoming, 'todo_form':todo_form}
    return render(request, 'todo/main.html', context)


@csrf_protect
def add_new_task(request):

    t_form = TodoForm()

    current = timezone.now()

    if request.method =='POST':
        t_form = TodoForm(request.POST)
        if t_form.is_valid():
            data = t_form.cleaned_data.get('title')
            completed = t_form.cleaned_data.get('completed')

            obj = Todo.objects.create(date_created=current, title=f'{data} {completed}', user_id=request.user)

    # context = {'obj':obj}

    return redirect('/')

@csrf_protect
def update_todo(request, pk):
    obj = Todo.objects.get(id=pk)
    form = TodoForm(instance=obj)
    if request.method == 'POST':
        form = TodoForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('/')

    context = {'form':form}
    return render(request, 'todo/update_task.html', context)


@csrf_protect
def delete_todo(request, pk):
    obj = Todo.objects.get(id=pk)
    obj.delete()

    context = {'obj':obj}
    return redirect('/')
