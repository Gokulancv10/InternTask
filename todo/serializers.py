from django.contrib.auth.models import User
from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer

from .models import Todo, Task


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'heading', 'date_created',
                  'todo', 'completed', 'user']


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']


class TodoSerializer(WritableNestedModelSerializer,
                     serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, allow_null=True, required=False)

    class Meta:
        model = Todo
        fields = ['id', 'title', 'date_created',
                  'completed', 'user_id', 'tasks']
