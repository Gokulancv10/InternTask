from django.shortcuts import render, redirect
from django.http import Http404
from django.utils import timezone
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST

from .models import Todo, Task
from .forms import TodoForm, TaskForm, UserRegisterForm


def register(request):

    form = UserRegisterForm()
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegisterForm()
    context = {'form': form}
    return render(request, 'todo/register.html', context)


def logout_user(request):

    logout(request)
    return redirect('login')


@login_required(login_url='login')
def home(request):

    task_form = TaskForm()
    todo_items_upcoming = Todo.objects.filter(
        user_id=request.user, completed=False).order_by('-date_created')
    todo_items_completed = Todo.objects.filter(
        user_id=request.user, completed=True).order_by('-date_created')
    pagination_upcoming = Paginator(todo_items_upcoming, 4)
    pagination_completed = Paginator(todo_items_completed, 4)
    page_upcoming = request.GET.get('upcoming', 1)
    page_completed = request.GET.get('completed', 1)
    page_data_upcoming = pagination_upcoming.get_page(page_upcoming)
    page_data_completed = pagination_completed.get_page(page_completed)

    todo_form = TodoForm()
    if request.method == "POST":
        todo_form1 = TodoForm(request.POST)
        if todo_form1.is_valid():
            data = todo_form1.cleaned_data.get('title')
            Todo.objects.create(
                date_created=timezone.now(), title=data, user_id=request.user)
        return redirect('/')
    context = {
        'todo_form': todo_form,
        'page_obj': page_data_upcoming,
        'page_obj2': page_data_completed,
        'pagi1': pagination_upcoming,
        'pagi2': pagination_completed,
        'page_num2': int(page_completed),
        'page_num': int(page_upcoming),
        'task_form': task_form,
        'todo_items_upcoming':len(todo_items_upcoming),
        'todo_items_completed':len(todo_items_completed)
    }
    return render(request, 'todo/main.html', context)


@login_required(login_url='login')
@require_POST
def update_todo(request, todo_id):

    try:
        obj = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as err:
        raise Http404(err)
    obj.title = request.POST.get('title')
    for task in obj.tasks.all():
        result = Task.objects.get(id=task.id)
        result.heading = request.POST.get('heading_'+str(task.id))
        result.save()
    obj.save()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
@require_POST
def update_task(request, task_id):

    try:
        obj = Task.objects.get(id=task_id, user=request.user)
    except Exception as err:
        raise Http404(err)
    obj.heading = request.POST.get('heading')
    obj.save()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
@require_POST
def add_task(request, task_id):
    try:
        obj = Todo.objects.get(id=task_id, user_id=request.user)
    except Exception as err:
        raise Http404(err)
    obj = Task.objects.create(heading=request.POST.get(
        'heading'), date_created=timezone.now(), todo=obj, user=request.user)
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def delete_todo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as err:
        raise Http404(err)
    todo.tasks.all().delete()
    todo.delete()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def delete_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
    except Exception as err:
        raise Http404(err)
    task.delete()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def completed_todo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as err:
        raise Http404(err)
    todo.tasks.filter(completed=False).update(completed=True)
    todo.completed = True
    todo.save()
    return redirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='login')
def completed_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
    except Exception as err:
        raise Http404(err)
    task.completed = True
    task.save()
    if task.todo.tasks.filter(completed=False).count() == 0:
        task.todo.completed = True
        task.todo.save()
    return redirect(request.META.get('HTTP_REFERER', '/'))
