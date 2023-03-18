{%- if cookiecutter.endpoint_use == 'services' %}
@app.route('{{cookiecutter.endpoint_url}}', methods=[{%- if cookiecutter.methods.get_m == "yes" -%}'GET',{% endif %}{%- if cookiecutter.methods.post == "yes" -%}'POST',{% endif %}{%- if cookiecutter.methods.put == "yes" -%}'PUT',{% endif %}{%- if cookiecutter.methods.delete == "yes" -%}'DELETE'{% endif %}])
def {{cookiecutter.endpoint_name}}():
{%- if cookiecutter.endpoint_comment %}
    """
        {{cookiecutter.endpoint_comment}} 
    """
{%- endif %}
    return '{{cookiecutter.endpoint_name}}'
{% endif %}
{%- if cookiecutter.endpoint_use == 'app_web' %}
@{{cookiecutter.bp_name}}.route('{{cookiecutter.endpoint_url}}', methods=[{%- if cookiecutter.methods.get_m == "yes" -%}'GET',{% endif %}{%- if cookiecutter.methods.post == "yes" -%}'POST',{% endif %}{%- if cookiecutter.methods.put == "yes" -%}'PUT',{% endif %}{%- if cookiecutter.methods.delete == "yes" -%}'DELETE'{% endif %}])
def {{cookiecutter.endpoint_name}}():
{%- if cookiecutter.endpoint_comment %}
    """
        {{cookiecutter.bp_name}}/{{cookiecutter.endpoint_name}}
        {{cookiecutter.endpoint_comment}} 
    """
{%- endif %}
    return '{{cookiecutter.endpoint_name}}'
{%- endif %}
