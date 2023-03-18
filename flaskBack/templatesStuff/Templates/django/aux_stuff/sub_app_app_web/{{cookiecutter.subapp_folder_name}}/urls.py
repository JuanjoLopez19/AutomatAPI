from django.urls import path, re_path
from . import views

app_name = '{{cookiecutter.subapp_name}}'
urlpatterns = [
   {%- if cookiecutter.methods.get_m == "yes"%}
    re_path(
        r"^{{cookiecutter.model.model_name}}/$",
        view=views.{{cookiecutter.model.model_name|capitalize}}ListView.as_view(),
        name='{{cookiecutter.model.model_name}}_list',
    ),
    re_path(
        r"^{{cookiecutter.model.model_name}}/(?P<pk>\d+)/$",
        view=views.{{cookiecutter.model.model_name|capitalize}}DetailView.as_view(),
        name='{{cookiecutter.model.model_name}}_detail',
    ),
    {%- endif %}
    {%- if cookiecutter.methods.post == "yes"%}
    re_path(
        r"^{{cookiecutter.model.model_name}}/~create/$",
        view=views.{{cookiecutter.model.model_name|capitalize}}CreateView.as_view(),
        name='{{cookiecutter.model.model_name}}_create',
    ),
    {%- endif %}
    {%- if cookiecutter.methods.put == "yes"%}
    re_path(
        r"^{{cookiecutter.model.model_name}}/(?P<pk>\d+)/~update/$",
        view=views.{{cookiecutter.model.model_name|capitalize}}UpdateView.as_view(),
        name='{{cookiecutter.model.model_name}}_update',
    ),
    {%- endif %}
    {%- if cookiecutter.methods.delete == "yes"%}
    re_path(
        r"^{{cookiecutter.model.model_name}}/(?P<pk>\d+)/~delete/$",
        view=views.{{cookiecutter.model.model_name|capitalize}}DeleteView.as_view(),
        name='{{cookiecutter.model.model_name}}_delete',
    ),
    {%- endif %}
    path('{{cookiecutter.endpoint_name}}/', views.{{cookiecutter.endpoint_name| capitalize}}.as_view(), name='{{cookiecutter.endpoint_name}}')
]