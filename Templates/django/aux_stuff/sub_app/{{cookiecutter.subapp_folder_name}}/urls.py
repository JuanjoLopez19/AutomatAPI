from django.urls import path, include
from .views import {{cookiecutter.model.model_name|capitalize}}View, {{cookiecutter.model.model_name|capitalize}}DetailView

urlpatterns = [
    path('{{cookiecutter.endpoint_name}}', {{cookiecutter.model.model_name|capitalize}}View.as_view()),
    path('{{cookiecutter.endpoint_name}}/<int:{{cookiecutter.model.model_name}}_id>/',{{cookiecutter.model.model_name|capitalize}}DetailView.as_view() )  
]