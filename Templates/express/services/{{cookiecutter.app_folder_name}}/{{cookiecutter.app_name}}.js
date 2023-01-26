{%if cookiecutter.strict %}'use strict'{% endif %}
import express from 'express';
{% if cookiecutter.body_parser %}
import bodyParser from 'body-parser';
{% endif %}
app = express();
{% if cookiecutter.body_parser %}
app.use(bodyParser.json());
{% endif %}

