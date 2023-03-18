from rest_framework import serializers
from .models import {{cookiecutter.model.model_name|capitalize}}

class {{cookiecutter.model.model_name|capitalize}}Seralizer(serializers.ModelSerializer):
    class Meta:
        model = {{cookiecutter.model.model_name|capitalize}}
        fields = [{%- for field in cookiecutter.model.model_fields %}"{{field['name']}}",{%- endfor %}"user"] 