# {{Cookiecutter.app_name}} Flask web service API <br>
The scheme of the url paths is: <br>
{%- for endpoint in cookiecutter.endpoints.list %}
- {{endpoint['endpoint_url']}}
	- Endpoint methods:	 
		{%- for key, value in endpoint['methods'] %}
			{% if value == "yes" %}
				- {{key}}
			{% endif %}
		{% endfor %}
{% endfor %}
