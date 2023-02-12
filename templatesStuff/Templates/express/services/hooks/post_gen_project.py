import os, sys, shutil
REMOVE_FILES = []

{%if cookiecutter.config_file == "" %}
REMOVE_FILES.append('config.json')
{%endif%}
{%if cookiecutter.use_controllers == "" %}
REMOVE_FILES.append('controllers')
{%endif%}
{%if cookiecutter.connect_DB == "" %}
REMOVE_FILES.append('database')
REMOVE_FILES.append('models')
{%endif%}


for path in REMOVE_FILES:
    path = path.strip()
    if path and os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.unlink(path)