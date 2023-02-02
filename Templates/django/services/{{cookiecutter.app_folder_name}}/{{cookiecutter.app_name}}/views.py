{%- if cookiecutter.use_routers == 'no' %}
from rest_framework.views import APIView # esta si no es router
{%- else %}
from rest_framework import viewsets # Esta si es router
{%- endif %}
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
