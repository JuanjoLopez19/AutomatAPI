{%- if cookiecutter.config_file == "yes" %}
let port = config.settings.port
{%- else %}
let port = {{cookiecutter.port}}
{%- endif %}
app.listen(process.env.PORT || port, 
	() => console.log(`Server is running in port ${process.env.PORT || port}`));
