from django.shortcuts import render, redirect
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
    todo_items = Todo.objects.all().order_by('-date_created')

    context = {'todo_items':todo_items}
    return render(request, 'todo/main.html', context)

@csrf_protect
def add_new_task(request):

    # print(request.POST)
    current = timezone.now()
    content = request.POST.get("content",False)
    obj = Todo.objects.create(date_created=current, title=content)

    context = {'obj':obj}

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



def is_validQuery(param):
    return param!='' and param is not None

def todoFilter(request):
    qs = Todo.objects.all()
    pending = request.GET.get('P')
    completed = request.GET.get('C')

    if is_validQuery(pending):
        qs = qs.filter(value_contains = pending)

    elif is_validQuery(completed):
        qs = qs.filter(value = completed)

    else:
        qs = qs.objects.all().order_by('-date_created')