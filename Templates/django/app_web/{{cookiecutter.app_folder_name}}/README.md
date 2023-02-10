# {{cookiecutter.app_name}} Django web app API <br>
This is a Django web app API that has been generated using the cookiecutter-django-api template. <br>
## General Settings
The API will run in the port {{cookiecutter.port}}. <br>
{%- if cookiecutter.db%}
This API uses a database and has implemented a ORM to interact with it. <br>
{%- if cookiecutter.db.db_type == "oracle" %}
The database engine is an Oracle database, to use it you need to install an Oracle client. <br>
{% else %}
This API has a default connection to a sqlite3 database named {{cookiecutter.app_name}}_database.sqlite3.<br>
{%- endif %}
{%- endif %}
{%- if cookiecutter.admin_url == "yes" %}
The admin url is: http://localhost:{{cookiecutter.port}}/{{cookiecutter.admin_url_name}} <br>
{%- endif %}
{%- if cookiecutter.web_browser == "yes" %}
The admin url is: http://localhost:{{cookiecutter.port}}/{{cookiecutter.web_browser_url}} <br>
{%- endif %}

## Installation & SetUp
To install the dependencies, run: <br>
```bash 
pip install -r requirements.txt 
```

Create the superuser: <br>
```bash
python manage.py createsuperuser 
```

{%- if cookiecutter.sub_apps %}
Then you need to run the migrations of each sub app: <br>
```bash
{% for app in cookiecutter.sub_apps.apps %}
{%- for key, value in app.items() %}
python manage.py makemigrations {{key}}
{%- endfor %}
{%- endfor %}
```
{%- endif %}

And finally run the migrations: <br>
```bash
python manage.py migrate
```

## Running the API <br>
To run the API, run: <br>
```bash 
python manage.py runserver
```

{%- if cookiecutter.sub_apps %}
## Sub Apps
The subparts of the project are: <br>
{%- for app in cookiecutter.sub_apps.apps %}
{%- for key, value in app.items() %}
### SubApp {{key}}
	- SubApp url: /{{value['middleware']}}/
	- SubApp model:
		- Model name: {{value['model']['model_name']}}
		- Model fields:
			{%- for field in value['model']['model_fields'] %}
			- {{field['name']}}: {{field['type']}}
			{%- endfor %}	
	- SubApp endpoint:
		- Endpoint url: /{{value['middleware']}}/{{value['endpoint_name']}}/
		- Endpoint methods:
			{%- for key, value in value['methods'].items() %}
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
{%- endif %}

## API endpoints <br>
The scheme of the url paths is: <br>
{%- for endpoint in cookiecutter.endpoints.list %}
- /{{endpoint['endpoint_url']}}/
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