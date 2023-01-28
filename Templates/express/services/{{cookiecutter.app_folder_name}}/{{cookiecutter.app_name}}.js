{%if cookiecutter.strict %}'use strict'{% endif %}
import express from 'express';
{%- if cookiecutter.body_parser %}
import bodyParser from 'body-parser';
{% endif %}
{%- if cookiecutter.cors %}
import cors from 'cors';
{% endif %}
{%- if cookiecutter.config_file %}
import config from './config';
{% endif %}
app = express();
{%- if cookiecutter.body_parser %}
app.use(bodyParser.json());
{% endif %}
{%- if cookiecutter.cors %}
app.use(cors());
{% endif %}
{%- if cookiecutter.use_controllers %}
{%- for i in cookiecutter.controllers_list.list %}
{%- for key, value in i.items() %}
app.use('/{{key}}/', require('./controllers/{{key}}'));
{%- endfor %}
{%- endfor %}
{% endif %}
