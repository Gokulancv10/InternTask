from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseNotFound, JsonResponse, HttpResponseRedirect
from .models import Todo, Task
from .forms import *
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.generic import View
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST


def register(request):

    form = userRegisterForm()
    if request.method == 'POST':
        form = userRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password2')
            return redirect('login')
    else:
        form = userRegisterForm()

    context = {'form': form}
    return render(request, 'todo/register.html', context)


def logoutUser(request):
    logout(request)
    return redirect('login')


@login_required(login_url='login')
def home(request):
    
    task_form = TaskForm()

    todo_items_upcoming = Todo.objects.filter(user_id=request.user, completed=False).order_by('-date_created')
    todo_items_completed = Todo.objects.filter(user_id=request.user, completed=True).order_by('-date_created')

    pagi1 = Paginator(todo_items_upcoming, 4)
    pagi2 = Paginator(todo_items_completed, 4)

    page_num = request.GET.get('upcoming', 1)
    page_num2 = request.GET.get('completed', 1)

    page_obj = pagi1.get_page(page_num)
    page_obj2 = pagi2.get_page(page_num2)

    todo_form = TodoForm()
    if request.method == "POST":
        todo_form1 = TodoForm(request.POST)
        if todo_form1.is_valid():
            data = todo_form1.cleaned_data.get('title')
            obj = Todo.objects.create(
                date_created=timezone.now(), title=data, user_id=request.user)
        return redirect('/')

    context = {'todo_form': todo_form, 'page_obj': page_obj, 'page_obj2': page_obj2,
               'pagi1': pagi1, 'pagi2': pagi2, 'page_num2': int(page_num2), 'page_num': int(page_num), 'task_form': task_form}
    return render(request, 'todo/main.html', context)


@login_required(login_url='login')
def update_todo(request, pk):

    try:
        obj = Todo.objects.get(id=pk, user_id=request.user)
        print(obj)
    except Exception as err:
        raise Http404(err)

    upform = TodoForm(instance=obj)
    if request.method == 'POST':
        upform = TodoForm(request.POST, instance=obj)
        if upform.is_valid():
            upform.save()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
@require_POST
def add_task(request, pk):

    try:
        obj = Todo.objects.get(id=pk, user_id=request.user)
    except Exception as err:
        raise Http404(err)

    Task.objects.create(heading=request.POST.get('heading'), date_created=timezone.now(), 
            todo=obj, user=request.user)
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def delete_todo(request, pk):

    try:
        todo = Todo.objects.get(id=pk, user_id=request.user)
    except Exception as err:
        raise Http404(err)

    todo.tasks.all().delete()
    todo.delete()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def delete_task(request, pk):

    try:
        task = Task.objects.get(id=pk, user=request.user)
    except Exception as err:
        raise Http404(err)

    task.delete()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def completed_todo(request, pk):

    try:
        todo = Todo.objects.get(id=pk, user_id=request.user)
    except Exception as err:
        raise Http404(err)
    todo.completed = True
    todo.tasks.filter(completed=False).update(completed=True)
    todo.save()  
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def completed_task(request, pk):

    try:
        task = Task.objects.get(id=pk, user=request.user)
    except Exception as err:
        raise Http404(err)

    task.completed = True
    task.save()            
    print(task.todo.tasks.filter(completed=True))
    if task.todo.tasks.filter(completed=False).count() == 0:
        task.todo.completed = True
        task.todo.save()

    return redirect(request.META.get('HTTP_REFERER', '/'))