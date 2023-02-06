from django.apps import AppConfig

class {{cookiecutter.subapp_name}}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'subapps.{{cookiecutter.subapp_name}}'
