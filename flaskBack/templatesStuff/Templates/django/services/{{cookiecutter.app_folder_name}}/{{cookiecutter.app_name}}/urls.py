"""{{cookiecutter.app_name}} URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
{%- if cookiecutter.admin_url == "yes" %}
from django.contrib import admin
{%- endif %}
from django.urls import path, include
{% for app in cookiecutter.sub_apps.apps %}
{%- for key, value in app.items() %}
from subapps.{{key}} import urls as {{key}}_urls
{%- endfor %}
{%- endfor %}
{%- for value in cookiecutter.endpoints.list %}
from .views import {{value['endpoint_name'] | capitalize}}
{%- endfor %}

urlpatterns = [
    {%- if cookiecutter.admin_url == "yes" %}
    path('{{cookiecutter.admin_url_name}}/', admin.site.urls),
    {%- endif %}
    {%- if cookiecutter.web_browser == "yes" %}
    path('{{cookiecutter.web_browser_url}}/', include('rest_framework.urls')),
    {%- endif %}
    {%- for app in cookiecutter.sub_apps.apps %}
    {%- for key, value in app.items() %}
    path('{{value['middleware']}}/', include({{key}}_urls), name='{{key}}'),
    {%- endfor %}
    {%- endfor %}
    {%- for value in cookiecutter.endpoints.list %}
    path('{{value['endpoint_url']}}/', {{value['endpoint_name'] | capitalize}}.as_view(), name='{{value['endpoint_name']}}'),
    {%- endfor %}
]
