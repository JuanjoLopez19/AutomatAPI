from django.urls import path, include
from .views import {{cookiecutter.model.model_name|capitalize}}View{%- if cookiecutter.methods.put == "yes" or cookiecutter.methods.delete == "yes" %}, {{cookiecutter.model.model_name|capitalize}}DetailView {%- endif %}

urlpatterns = [
    path('{{cookiecutter.endpoint_name}}', {{cookiecutter.model.model_name|capitalize}}View.as_view()),
    {%- if cookiecutter.methods.put == "yes" or cookiecutter.methods.delete == "yes" %}
    path('{{cookiecutter.endpoint_name}}/<int:{{cookiecutter.model.model_name}}_id>/',{{cookiecutter.model.model_name|capitalize}}DetailView.as_view() )
    {%- endif %}
]