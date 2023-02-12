from flask import Blueprint, jsonify
from models.model import db, Users, Templates
from templatesStuff.template_methods import *
from templatesStuff.aux_data import *

templates = Blueprint('templates', __name__, url_prefix='/templates')

@templates.route('', methods=['GET','POST'])
def get_templates():
    """
        templates
        This is a test endpoint 
    """
    path = temp_creator(flask_test_service, "flask", "services")
    temp_creator(flask_test_service, "flask", "services")
    temp_creator(flask_test_app, "flask", "app_web")
    temp_creator(express_test_service, "express", "services")
    temp_creator(express_test_app, "express", "app_web")
    temp_creator(django_test_service, "django", "services")
    temp_creator(django_test_app, "django", "app_web")
    return jsonify({'message': path})