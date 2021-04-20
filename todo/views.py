from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView

from .models import Todo, Task
from .forms import TodoForm, TaskForm, UserRegisterForm
from .serializers import TodoSerializer, TaskSerializer, UserSerializer


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


@login_required
def list(request):
    return render(request, 'todo/main.html')


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'All Todo Items': '/api/todo-list/',
        'Todo Items Incomplete': '/api/todo-list-incomplete/',
        'Todo Items Completed': '/api/todo-list-completed/',
        'Specific Todo Item': '/api/todo-list/<int:todo_id>/',
        'Create new Todo Item': '/api/create-todo/',
        'Update already exists Todo item': '/api/update-todo/<int:todo_id>/',
        'Delete Specific Todo Item': '/api/delete-todo/<int:todo_id>/',
        'All Task Items': '/api/task-list/',
        'Specific Task Item': '/api/task-list/<int:taskid>/',
        'Create new Task Item': '/api/create-task/',
        'Update already exists Task item': '/api/update-task/<int:task_id>/',
        'Delete Specific Task Item': '/api/delete-task/<int:task_id>/',
    }
    return Response(api_urls)


@api_view(['GET'])
def todoList(request):
    todo = Todo.objects.filter(user_id=request.user).order_by('-date_created')
    serializer = TodoSerializer(todo, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def todoListIncomplete(request):
    todo = Todo.objects.filter(
        user_id=request.user, completed=False).order_by('completed')
    serializer = TodoSerializer(todo, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def todoListCompleted(request):
    todo = Todo.objects.filter(
        user_id=request.user, completed=True).order_by('-date_created')
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
    return Response(serializer.errors)


@api_view(['POST'])
def createTask(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


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
    return Response(serializer.errors)


@api_view(['POST'])
def completeTodoTask(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    todo.tasks.filter(completed=False).update(completed=True)
    todo.completed = True
    todo.save()

    serializer = TodoSerializer(instance=todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['POST'])
def completeTask(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    task.completed = True
    task.save()
    if task.todo.tasks.filter(completed=False).count() == 0:
        task.todo.completed = True
        task.todo.save()
    serializer = TodoSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


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
    return Response(serializer.errors)


@api_view(['DELETE'])
def deleteTodo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    todo.tasks.all().delete()
    todo.delete()
    return Response('Todo Deleted Successfully!!')


@api_view(['DELETE'])
def deleteTask(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user_id=request.user)
    except Exception as e:
        return HttpResponse(e)
    task.delete()
    return Response('Task Deleted Successfully!!')


class IncompleteTodoPagination(PageNumberPagination):
    page_size = 3
    page_query_param = 'incomplete'
    page_size_query_param = 'i'
    max_page_size = 10

    def get_paginated_response(self, data):

        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page_no': self.page.number,
            'per_page': self.page.paginator.per_page,
            'results': data
        })


class CompletedTodoPagination(PageNumberPagination):
    page_size = 3
    page_query_param = 'completed'
    page_size_query_param = 'c'
    max_page_size = 10

    def get_paginated_response(self, data):

        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page_no': self.page.number,
            'per_page': self.page.paginator.per_page,
            'results': data
        })


@api_view(['GET'])
def todoIncomplete(request):
    todo = Todo.objects.filter(
        user_id=request.user, completed=False).order_by('-date_created')
    paginator = IncompleteTodoPagination()
    result_page = paginator.paginate_queryset(todo, request)
    serializer = TodoSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def todoCompleted(request):
    todo = Todo.objects.filter(
        user_id=request.user, completed=True).order_by('-date_created')
    paginator = CompletedTodoPagination()
    result_page = paginator.paginate_queryset(todo, request)
    serializer = TodoSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)