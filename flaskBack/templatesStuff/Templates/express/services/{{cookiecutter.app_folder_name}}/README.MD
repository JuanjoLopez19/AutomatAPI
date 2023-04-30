# {{cookiecutter.app_name}} Express web service API <br>
This is a Express web service API that has been generated using the cookiecutter-express-api template. <br>
## General Settings
The API will run in the port {{cookiecutter.port}}. <br>
{%- if cookiecutter.connect_DB == "yes" %}
This API uses a database and has implemented a ORM to interact with it using sequelize. <br>
{%- endif %}
{%- if cookiecutter.config_file == "yes" %}
This API uses a config file to store the settings {%- if cookiecutter.connect_DB == "yes" %} and the database credentials {%- endif %}<br>
{%- endif %}
{%- if cookiecutter.cors == "yes" %}
This API uses CORS to allow cross-origin requests. <br>
{%- endif %}
{%- if cookiecutter.cors == "body_parser" %}
This API uses body-parser to parse the data to a JSON <br>
{%- endif %}
{%- if cookiecutter.cors == "strict" %}
This API uses strict mode <br>
{%- endif %}
## Installation 
To install the dependencies, run: <br>
```bash 
npm install 
``` 

## Running the API <br>

To run the API, run: <br>
```bash 
npm start 
```

{%- if cookiecutter.use_controllers == "yes" %}
## Controllers
The controllers used in this API are: <br>
{%- for controller in cookiecutter.controllers_list.list %}
{%- for key, endpoints in controller.items() %}
- {{key}}
    {%- for endpoint in endpoints %}
    - {{endpoint['endpoint_url']}}
	    - Endpoint method: {{endpoint['method']}}	 	
    {%- endfor %}
{%- endfor %}
{%- endfor %}
{%- endif %}
## API endpoints <br>
The scheme of the url paths is: <br>
{%- for endpoint in cookiecutter.endpoints.list %}
- {{endpoint['endpoint_url']}}
	- Endpoint method: {{endpoint['method']}}	 	
{%- endfor %}
<br>