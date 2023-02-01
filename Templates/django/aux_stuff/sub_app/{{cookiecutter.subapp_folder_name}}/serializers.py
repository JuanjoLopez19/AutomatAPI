from rest_framework import serializers
from .models import {{cookiecutter.model.model_name}}

class {{cookiecutter.model.model_name |capitalize}}Seralizer(serializers.ModelSerializer):
    class Meta:
        model = {{cookiecutter.model.model_name}}
        fields = ["task", "completed", "timestamp", "updated", "user"] # añadir los campos