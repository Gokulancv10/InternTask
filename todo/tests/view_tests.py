from django.shortcuts import redirect
from todo.tests.model_tests import User
from django.test import TestCase, client, Client
from todo.views import (register, logout_user, todoListView,
    taskListView, createTodo, createTask, updateTodo,
    updateTask, deleteTodo, deleteTask, completeTodoTask,
    completeTask)
from todo.models import Todo, Task
from django.contrib.auth import get_user_model
from django.urls import reverse
# from django.http import response

class RegisterTestCase(TestCase):
    User = get_user_model()
    # client = Client()

    def setUp(self):
        self.username = 'testuser'
        self.email = 'testuser@gmail.com'
        self.password = '@bcd1234'

    def test_register_page_url(self):
        response = self.client.get('/register/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name='todo/register.html')

    def test_register_form(self):
        response = self.client.post('/register/',
            data = {
                'username': self.username,
                'email': self.email,
                'password1': self.password,
                'password2': self.password
            }, follow=True)
        self.assertEqual(response.status_code, 200)
        users = User.objects.all()
        self.assertEqual(users.count(), 1)


class LogoutUserTest(TestCase):
    User = get_user_model()

    def test_logout_url(self):
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name='todo/logout.html')

    def test_logout_page(self):
        resp = self.client.post('/logout/')
        self.assertEqual(resp.status_code, 200)