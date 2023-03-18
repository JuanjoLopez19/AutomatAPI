from flask import Blueprint, jsonify
from models.model import db, Users, Templates

users = Blueprint('users', __name__, url_prefix='/users')

@users.route('', methods=['GET','POST'])
def get_templates():
    """
        templates
        This is a test endpoint 
    """
    return jsonify({'message': db.session.execute(db.select(Users)).scalar_one().serialize()})