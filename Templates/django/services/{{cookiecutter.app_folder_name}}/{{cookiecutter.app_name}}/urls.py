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
{%- if cookiecutter.admin_url %}
from django.contrib import admin
{%- endif %}
from django.urls import path, include

urlpatterns = [
    {%- if cookiecutter.admin_url %}
    path('{{cookiecutter.admin_url_name}}/', admin.site.urls),
    {%- endif %}
    {%- if cookiecutter.web_browser %}
    path('{{cookiecutter.web_browser_url}}/', include('rest_framework.urls')),
    {%- endif %}
]
