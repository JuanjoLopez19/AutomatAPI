{%if cookiecutter.strict %}'use strict'{% endif %}
import express from 'express';
let {{cookiecutter.controller_name}} = express.Router();

// Here goes the endpoints