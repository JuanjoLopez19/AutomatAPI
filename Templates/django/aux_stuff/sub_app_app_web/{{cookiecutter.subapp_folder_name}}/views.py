from django.views.generic import (CreateView, DeleteView, DetailView, UpdateView, ListView)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import {{cookiecutter.model.model_name|capitalize}}

{% if cookiecutter.methods.get_m == "yes"%}
class {{cookiecutter.model.model_name|capitalize}}ListView(ListView):
    model = {{cookiecutter.model.model_name|capitalize}}

class {{cookiecutter.model.model_name|capitalize}}DetailView(DetailView):
    model = {{cookiecutter.model.model_name|capitalize}}

{% endif %}

{%- if cookiecutter.methods.post == "yes"%}
class {{cookiecutter.model.model_name|capitalize}}CreateView(CreateView):
    model = {{cookiecutter.model.model_name|capitalize}}
    
{% endif %}

{%- if cookiecutter.methods.put == "yes"%}
class {{cookiecutter.model.model_name|capitalize}}UpdateView(UpdateView):
    model = {{cookiecutter.model.model_name|capitalize}}
    
{% endif %}

{%- if cookiecutter.methods.delete == "yes"%}
class {{cookiecutter.model.model_name|capitalize}}DeleteView(DeleteView):
    model = {{cookiecutter.model.model_name|capitalize}}
    
{% endif %}