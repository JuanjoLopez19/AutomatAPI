{%if cookiecutter.strict %}'use strict'{% endif %}
const express = require('express');
let {{cookiecutter.controller_name}} = express.Router();

// Here goes the endpoints
