const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
{%- if cookiecutter.body_parser %}
const bodyParser = require('body-parser')
{% endif %}
{%- if cookiecutter.cors %}
const cors = require('cors')
{% endif %}
{%- if cookiecutter.connect_DB %}
const db = require('./database/database')
{% endif %}
const app = express();
{%- if cookiecutter.body_parser %}
app.use(bodyParser.json());
{% endif %}
{%- if cookiecutter.cors %}
app.use(cors());
{% endif %}
{%- if cookiecutter.view_engine %}
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '{{cookiecutter.view_engine}}');
{% endif %}

app.use(logger('dev'));
{%- if cookiecutter.body_parser == "" %}
app.use(express.json());
{% endif %}
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

{%- if cookiecutter.use_controllers %}
{%- for i in cookiecutter.controllers_list.list %}
{%- for key, value in i.items() %}
app.use('/{{key}}/', require('./controllers/{{key}}'));
{%- endfor %}
{%- endfor %}
{% endif %}

