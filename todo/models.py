from django.db import models
from django.conf import settings

# Create your models here.

class Todo(models.Model):

	date_created = models.DateTimeField(auto_now_add=True)
	completed = models.BooleanField(default=False)
	title = models.CharField(max_length=200)

	user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

	def __str__(self):
		return self.title
