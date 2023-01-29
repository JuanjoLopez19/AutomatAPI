{%if cookiecutter.strict %}'use strict'{% endif %}
const Express = require('express')
{%- if cookiecutter.body_parser %}
const bodyParser = require('body-parser')
{% endif %}
{%- if cookiecutter.cors %}
const cors = require('cors')
{% endif %}
{%- if cookiecutter.config_file %}
const config = require('./config')
{% endif %}
const app = Express();
{%- if cookiecutter.body_parser %}
app.use(bodyParser.json());
{% endif %}
{%- if cookiecutter.cors %}
app.use(cors());
{% endif %}
{%- if cookiecutter.connect_DB %}
const db = require('./database/database')
{% endif %}
{%- if cookiecutter.use_controllers %}
{%- for i in cookiecutter.controllers_list.list %}
{%- for key, value in i.items() %}
app.use('/{{key}}/', require('./controllers/{{key}}'));
{%- endfor %}
{%- endfor %}
{% endif %}
