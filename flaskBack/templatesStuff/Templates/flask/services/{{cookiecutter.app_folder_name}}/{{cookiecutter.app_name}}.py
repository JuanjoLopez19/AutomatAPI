from flask import Flask
{%- if cookiecutter.connect_DB == 'yes' %}
from flask_sqlalchemy import SQLAlchemy
from models.models import db
{%- endif %}
{%- if cookiecutter.cors == "yes" %}
from flask_cors import CORS
{%- endif %}

app = Flask(__name__)
{%- if cookiecutter.cors %}
CORS(app)
{%- endif %}
{% if cookiecutter.config_file == 'yes' %}
# Here goes if theres config file
app.config.from_pyfile('./config.cfg')
{%- endif %}
{% if cookiecutter.connect_DB == 'yes' %}
# Creating an SQLAlchemy instance
db.init_app(app)
{%- endif %}

#Here goes the endpoinst to be added
