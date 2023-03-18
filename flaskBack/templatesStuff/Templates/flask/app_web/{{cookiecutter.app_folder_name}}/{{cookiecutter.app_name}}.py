from flask import Flask{%- if cookiecutter.handle_404 == 'yes' %}, render_template {% endif %}
{%- if cookiecutter.connect_DB == 'yes' %}
from flask_sqlalchemy import SQLAlchemy
from models.models import db
{%- endif %}
{%- if cookiecutter.cors == "yes" %}
from flask_cors import CORS
{%- endif %}
{%- if cookiecutter.use_bp == "yes" %}
{%- for bp in cookiecutter.bp_list.list %}
{%- for key, value in bp.items() %}
from blueprints.{{key}} import {{key}}
{%- endfor %}
{%- endfor %}
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
{% endif %}
{%- if cookiecutter.use_bp %}
{%- for i in cookiecutter.bp_list.list %}
{%- for key, value in i.items() %}
app.register_blueprint({{key}})
{%- endfor %}
{%- endfor %}
{%- endif %}

#Here goes the endpoinst to be added