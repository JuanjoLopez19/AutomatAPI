{%if cookiecutter.strict == "yes" %}'use strict'{% endif %}
const Express = require('express')
{%- if cookiecutter.body_parser == "yes" %}
const bodyParser = require('body-parser')
{%- endif %}
{%- if cookiecutter.cors == "yes" %}
const cors = require('cors')
{%- endif %}
{%- if cookiecutter.config_file == "yes" %}
const config = require('./config')
{%- endif %}
{%- if cookiecutter.connect_DB == "yes" %}
const db = require('./database/database')
{% endif %}
const app = Express();
{%- if cookiecutter.body_parser  == "yes" %}
app.use(bodyParser.json());
{% endif %}
{%- if cookiecutter.cors == "yes" %}
app.use(cors());
{% endif %}
{%- if cookiecutter.use_controllers == "yes" %}
{%- for i in cookiecutter.controllers_list.list %}
{%- for key, value in i.items() %}
app.use('/{{key}}/', require('./controllers/{{key}}'));
{%- endfor %}
{%- endfor %}
{% endif %}
