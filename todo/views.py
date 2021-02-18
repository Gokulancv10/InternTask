from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseNotFound, JsonResponse
from .models import Todo
from .forms import *
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.generic import View
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


@login_required(login_url='login')
def home(request):

    todo_form = TodoForm()
    current = timezone.now()

    todo_items_upcoming = Todo.objects.filter(user_id=request.user).filter(completed=False).order_by('-date_created')

    todo_items_completed = Todo.objects.filter(user_id=request.user).filter(completed=True)

    if request.method == "POST":
        todo_form = TodoForm(request.POST)
        if todo_form.is_valid():
            data = todo_form.cleaned_data.get('title')

            obj = Todo.objects.create(date_created=current, title=data, user_id=request.user)

    context = {'todo_items_upcoming':todo_items_upcoming,'todo_items_completed':todo_items_completed, 'todo_form':todo_form}
    return render(request, 'todo/main.html', context)


@login_required(login_url='login')
def update_todo(request, pk):

    try :
        obj = Todo.objects.get(id=pk)

        upform = TodoForm(instance=obj)
        if request.method == 'POST':
            upform = TodoForm(request.POST, instance=obj)
            if upform.is_valid():
                upform.save()
                return redirect('/')

        context = {'upform':upform}
        return render(request, 'todo/update_task.html', context)

    except Exception as err:
        raise Http404(err)

@login_required(login_url='login') 
def delete_todo(request, pk):

    try:
        obj = Todo.objects.get(id=pk)
        obj.delete()

        # context = {'obj':obj}
        return redirect('/')

    except Exception as err:
        raise Http404(err)

@login_required(login_url='login')
def completed_todo(request, pk):

    try:
        obj = Todo.objects.get(id=pk)
        obj.completed = True
        obj.save()

        # context = {'obj':obj}
        return redirect('/')

    except Exception as err:
        raise Http404(err)