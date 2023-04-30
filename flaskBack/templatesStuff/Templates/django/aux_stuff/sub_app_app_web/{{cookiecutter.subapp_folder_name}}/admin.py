from django.contrib import admin

# Register your models here.
{%- if cookiecutter.model_editable == "yes" %}
from .models import {{cookiecutter.model.model_name|capitalize}}
admin.site.register({{cookiecutter.model.model_name|capitalize}})
{%- endif %}