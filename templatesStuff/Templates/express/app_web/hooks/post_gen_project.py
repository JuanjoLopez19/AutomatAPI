import os, sys, shutil
REMOVE_FILES = []
{%if cookiecutter.use_ssl == "no" %}
REMOVE_FILES.append('certificates')
{% endif %}
{%if cookiecutter.config_file == "no" %}
REMOVE_FILES.append('config.json')
{%endif%}
{%if cookiecutter.use_controllers == "no" %}
REMOVE_FILES.append('controllers')
{%endif%}
{%if cookiecutter.connect_DB == "no" %}
REMOVE_FILES.append('database')
REMOVE_FILES.append('models')
{%endif%}
{% if cookiecutter.view_engine == "" %}
REMOVE_FILES.append('views')
{% endif %}
{% if cookiecutter.view_engine %}
REMOVE_FILES.append('public/index.html')
{% endif %}
{% if cookiecutter.view_engine == "ejs" or cookiecutter.view_engine == "hjs" %}
REMOVE_FILES.append('views/layout.{{cookiecutter.view_engine}}')
{% endif %}


for path in REMOVE_FILES:
    path = path.strip()
    if path and os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.unlink(path)