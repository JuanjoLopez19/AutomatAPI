import os,sys,shutil

REMOVE_FILES = ['{%if cookiecutter.config_file == "no" %}config.cfg{%endif%}']
{%if cookiecutter.connect_DB == "no" %}
REMOVE_FILES.append('models')
{% endif %}
{%if cookiecutter.use_ssl == "no" %}
REMOVE_FILES.append('certificates')
{% endif %}
{%if cookiecutter.use_bp == "no" %}
{% for i in cookiecutter.bp_list.list %}
{% for key, value in i.items() %}
REMOVE_FILES.append('{{key}}.py')
{% endfor %}
{% endfor %}
{% endif %}

for path in REMOVE_FILES:
    path = path.strip()
    if path and os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.unlink(path)