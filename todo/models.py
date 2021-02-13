from django.db import models
from django.conf import settings

# Create your models here.

class Todo(models.Model):
	# options = (('C','Completed'),
	# 	('P','Pending'))
	date_created = models.DateTimeField(auto_now_add=True)
	completed = models.BooleanField(default=False)
	title = models.CharField(max_length=200)
	# YorN = models.CharField(max_length=20, choices=options,default='P')
	# end_date = models.DateTimeField(auto_now_add=False, auto_now=False, blank=False, null=False)
	user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

	def __str__(self):
		return self.title