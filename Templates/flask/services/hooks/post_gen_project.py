import os,sys,shutil

REMOVE_FILES = ['{%if cookiecutter.config_file == "" %}config.cfg{%endif%}']

for path in REMOVE_FILES:
    path = path.strip()
    if path and os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.unlink(path)