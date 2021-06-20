from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from todo.models import Task, Todo

User = get_user_model()

class TodoTestCase(TestCase):

    def setUp(self):
        self.user1 = User.objects.create(username='testuser1')
        self.user2 = User.objects.create(username="testuser2")
        self.todo1 = Todo.objects.create(title="Testing 1", user_id=self.user1)
        self.todo2 = Todo.objects.create(title="Testing-2", user_id=self.user2)

    def test_string_representation(self):
        self.assertEqual(str(self.todo1), self.todo1.title)
        self.assertEqual(str(self.todo2), self.todo2.title)

    def test_todo_author(self):
        self.assertEqual(self.todo1.user_id, self.user1)
        self.assertEqual(self.todo2.user_id, self.user2)


class TaskTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser1')
        self.todo = Todo.objects.create(title="Todo Item-1", user_id=self.user)
        self.task = Task.objects.create(heading="Task-1", todo=self.todo,
            user=self.todo.user_id)

    def test_string_representation(self):
        self.assertEqual(str(self.task), self.task.heading)

    def test_task_author(self):
        self.assertEqual(self.task.user.username, self.user)
        