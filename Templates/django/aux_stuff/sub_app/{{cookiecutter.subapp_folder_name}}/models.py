from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class {{cookiecutter.model.model_name|capitalize}}(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, blank = True, null = True) # Esto fijo
    # Insertar los campos
