{%- if cookiecutter.endpoint_use == 'services' %}
@app.route('{{cookiecutter.endpoint_url}}', methods=[{%- if cookiecutter.get == "yes" -%}'GET',{% endif %}{%- if cookiecutter.post == "yes" -%}'POST',{% endif %}{%- if cookiecutter.put == "yes" -%}'PUT',{% endif %}{%- if cookiecutter.delete == "yes" -%}'DELETE'{% endif %}])
def {{cookiecutter.endpoint_name}}():
{%- if cookiecutter.endpoint_comment %}
    """
        {{cookiecutter.endpoint_comment}} 
    """
{%- endif %}
    return '{{cookiecutter.endpoint_name}}'
{% endif %}
{%- if cookiecutter.endpoint_use == 'app_web' %}
@{{cookiecutter.bp_name}}.route('{{cookiecutter.endpoint_url}}', methods=[{%- if cookiecutter.get == "yes" -%}'GET',{% endif %}{%- if cookiecutter.post == "yes" -%}'POST',{% endif %}{%- if cookiecutter.put == "yes" -%}'PUT',{% endif %}{%- if cookiecutter.delete == "yes" -%}'DELETE'{% endif %}])
def {{cookiecutter.endpoint_name}}():
{%- if cookiecutter.endpoint_comment %}
    """
        {{cookiecutter.bp_name}}/{{cookiecutter.endpoint_name}}
        {{cookiecutter.endpoint_comment}} 
    """
{%- endif %}
    return '{{cookiecutter.endpoint_name}}'
{%- endif %}
