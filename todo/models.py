from django.db import models
from django.conf import settings


class Todo(models.Model):

    date_created = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    title = models.CharField(max_length=200)
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title}'


class Task(models.Model):

    heading = models.CharField(max_length=100)
    todo = models.ForeignKey(
        Todo, on_delete=models.CASCADE, related_name='tasks')
    date_created = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.heading}'
