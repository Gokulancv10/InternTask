from django.shortcuts import render, redirect
from django.http import Http404, JsonResponse, HttpResponse
from django.utils import timezone
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Todo, Task
from .forms import TodoForm, TaskForm, UserRegisterForm
from .serializers import TodoSerializer, TaskSerializer


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


@api_view(['GET'])
def todoList(request):
    todo = Todo.objects.filter(user_id=request.user)
    serializer = TodoSerializer(todo, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def taskList(request):
    task = Task.objects.filter(user_id=request.user)
    serializer = TaskSerializer(task, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def todoListView(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    serializer = TodoSerializer(todo, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def taskListView(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def createTodo(request):
    serializer = TodoSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def createTask(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def updateTodo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)

    serializer = TodoSerializer(instance=todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def updateTask(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)

    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteTodo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    todo.delete()
    return Response('Todo Deleted Successfully!!')


@api_view(['DELETE'])
def deleteTask(request, task_id):
    try:
        task = Todo.objects.get(id=task_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    task.delete()
    return Response('Task Deleted Successfully!!')


@login_required(login_url='login')
def home(request):

    task_form = TaskForm()
    todo_items_incomplete = Todo.objects.filter(
        user_id=request.user, completed=False).order_by('-date_created')
    todo_items_completed = Todo.objects.filter(
        user_id=request.user, completed=True).order_by('-date_created')
    pagination_upcoming = Paginator(todo_items_incomplete, 4)
    pagination_completed = Paginator(todo_items_completed, 4)
    page_upcoming = request.GET.get('upcoming', 1)
    page_completed = request.GET.get('completed', 1)
    page_data_upcoming = pagination_upcoming.get_page(page_upcoming)
    page_data_completed = pagination_completed.get_page(page_completed)

    todo_form = TodoForm()
    if request.method == "POST":
        print(request)
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
        'todo_items_incomplete': len(todo_items_incomplete),
        'todo_items_completed': len(todo_items_completed)
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
