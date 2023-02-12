# {{cookiecutter.app_name}} Flask app web API <br>
This is a Flask App web API that has been generated using the cookiecutter-flask-api template. <br>
## General Settings
The API will run in the port {{cookiecutter.port}} and in the host {{cookiecutter.host}}. <br>
{%- if cookiecutter.connect_DB == "yes" %}
This API uses a database and has implemented a ORM to interact with it using SQLAlchemy. <br>
{%- endif %}
{%- if cookiecutter.config_file == "yes" %}
This API uses a config file to store the settings, the config file is set to {{cookiecutter.type_config_file}} mode. <br>
{%- endif %}
{%- if cookiecutter.cors == "yes" %}
This API uses CORS to allow cross-origin requests. <br>
{%- endif %}


## Installation 
To install the dependencies, run: <br>
```bash 
pip install -r requirements.txt 
``` 

## Running the API <br>

To run the API, run: <br>
```bash 
python run.py 
```

{%- if cookiecutter.use_bp == "yes" %}
## Blueprints
The blueprints used in this API are: <br>
{%- for bp in cookiecutter.bp_list.list %}
{%- for key, endpoints in bp.items() %}
- {{key}}
    {%- for endpoint in endpoints %}
    - {{endpoint['endpoint_url']}}
	    - Endpoint methods:	 
		{%- for key, value in endpoint['methods'].items() %}
            {%- if value == "yes" %}
			    {%- if key == "get_m" %}
            - get
                {%- else %}    
		    - {{key}}
                {%- endif %}
            {%- endif %}
		{%- endfor %}
    {%- endfor %}
{%- endfor %}
{%- endfor %}
{%- endif %}
## API endpoints <br>
The scheme of the url paths is: <br>
{%- for endpoint in cookiecutter.endpoints.list %}
- {{endpoint['endpoint_url']}}
	- Endpoint methods:	 
		{%- for key, value in endpoint['methods'].items() %}
			{%- if value == "yes" %}
                {%- if key == "get_m" %}
        - get
                {%- else %}    
		- {{key}}
                {%- endif %}
			{%- endif %}
		{%- endfor %}
{%- endfor %}
<br>