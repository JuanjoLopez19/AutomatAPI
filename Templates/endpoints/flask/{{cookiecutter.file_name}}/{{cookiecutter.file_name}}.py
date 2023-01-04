
@app.route('{{cookiecutter.endpoint_url}}', methods=['{%- if cookiecutter.get == "yes" -%}GET{% endif %}',
                                                     '{%- if cookiecutter.post == "yes" -%}POST{% endif %}',
                                                     '{%- if cookiecutter.put == "yes" -%}PUT{% endif %}',
                                                     '{%- if cookiecutter.delete == "yes" -%}DELETE{% endif %}'])
def {{cookiecutter.endpoint_name}}():
    return '{{cookiecutter.endpoint_name}}'
