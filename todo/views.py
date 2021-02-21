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

from django.core.paginator import Paginator

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

    todo_items_upcoming = Todo.objects.filter(user_id=request.user, completed=False).order_by('-date_created')

    todo_items_completed = Todo.objects.filter(user_id=request.user, completed=True)

    pagi1 = Paginator(todo_items_upcoming, 4)
    pagi2 = Paginator(todo_items_completed, 4)

    page_num = request.GET.get('page')
    page_num2 = request.GET.get('page')

    page_obj = pagi1.get_page(page_num)
    page_obj2 = pagi2.get_page(page_num2)

    if request.method == "POST":
        todo_form = TodoForm(request.POST)
        if todo_form.is_valid():
            data = todo_form.cleaned_data.get('title')

            obj = Todo.objects.create(date_created=current, title=data, user_id=request.user)

    context = {'todo_form':todo_form, 'page_obj':page_obj, 'page_obj2':page_obj2}
    return render(request, 'todo/main.html', context)


@login_required(login_url='login')
def update_todo(request, pk):

    try :
        obj = Todo.objects.get(id=pk, user_id=request.user)

    except Exception as err:
        raise Http404(err)

    upform = TodoForm(instance=obj)
    if request.method == 'POST':
        upform = TodoForm(request.POST, instance=obj)
        if upform.is_valid():
            upform.save()
            return redirect('/')

    context = {'upform':upform}
    return render(request, 'todo/update_task.html', context)

    

@login_required(login_url='login') 
def delete_todo(request, pk):

    try:
        obj = Todo.objects.get(id=pk, user_id=request.user)

    except Exception as err:
        raise Http404(err)

    obj.delete()
    return redirect('/')



@login_required(login_url='login')
def completed_todo(request, pk):

    try:
        obj = Todo.objects.get(id=pk, user_id=request.user)

    except Exception as err:
        raise Http404(err)
    
    obj.completed = True
    obj.save()
    
    return redirect('/')
