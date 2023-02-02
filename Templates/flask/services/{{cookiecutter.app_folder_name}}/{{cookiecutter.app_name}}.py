from flask import Flask
{%- if cookiecutter.connect_DB == 'yes' %}
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, migrate
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
db = SQLAlchemy(app)

# Settings for migrations
migrate = Migrate(app, db)

class {{cookiecutter.table_name}}(db.Model):
    id = db.Column('{{cookiecutter.table_name}}_id', db.Integer, primary_key = True)
    el_1 = db.Column(db.String(100))
    el_2 = db.Column(db.String(50))
    el_3 = db.Column(db.String(200)) 
    el_4 = db.Column(db.String(10))

    def __init__(self, el_1, el_2, el_3,el_4):
        self.el_1 = el_1
        self.el_2 = el_2
        self.el_3 = el_3
        self.el_4 = el_4
{%- endif %}

#Here goes the endpoinst to be added
