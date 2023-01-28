{{cookiecutter.handler_type}}.{{cookiecutter.method}}('{{cookiecutter.endpoint_url}}', (req, res) => {
        {%- if cookiecutter.endpoint_comment %}
        /* {{cookiecutter.endpoint_comment}} */
        {% endif -%}
        res.send('{{cookiecutter.endpoint_name}}')
});

