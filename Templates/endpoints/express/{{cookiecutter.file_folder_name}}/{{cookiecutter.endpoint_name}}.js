{{cookiecutter.handler_type}}.{{cookiecutter.method}}('{{cookiecutter.endpoint_url}}', (req, res, next) => {
        {%- if cookiecutter.endpoint_comment %}
        /* {{cookiecutter.endpoint_comment}} */
        {%- endif %}
        {%- if cookiecutter.handler_type == 'app' %}
        res.send('{{cookiecutter.endpoint_name}}')
        {%- else %}
        res.render('index', { title: 'Express' });
        {% endif %}
});

