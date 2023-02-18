from flask import Blueprint, jsonify, request
from models.model import db, Users, Templates, Role
from templatesStuff.template_methods import *
from templatesStuff.aux_data import *
from mongo_db import *
from bson.objectid import ObjectId
from bson.json_util import dumps

templates = Blueprint('templates', __name__, url_prefix='/templates')

@templates.route('', methods=['GET','POST'])
def get_templates():
    """
        Method Get: Return all templates the user has access to, if user is admin return all templates
            Body: user_id
        Method Post: Create a new template
            Body: user_id, template_data, tech, tech_type
    """

    if request.method == 'GET':
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return jsonify({'status': 'error', 'message': 'No body provided', 'code': 400})
        
        if not body:
            return jsonify({'status': 'error', 'message': 'The body of the request is empty', 'code': 400})
        
        user_id = body.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'The user_id is required', 'code': 400})
        try:
            user = db.get_or_404(Users, user_id)
            if user['role'] == Role.admin:
                templates_list = Templates.query.all()
            else:
                templates_list = Templates.query.filter_by(user_id=user_id).all()
            
            if not templates_list:
                return jsonify({'status': 'error', 'message': 'No templates found', 'code': 204})
            
            mongo_client = get_client()
            mongo_collection = get_collection(get_db(mongo_client,"automatAPI"),"templates")
            aux  = []
            
            for template in templates_list:
                ref = template['template_ref']
                temp = find_one(mongo_collection, ObjectId(ref.replace(' ','')))
                if temp:
                    aux.append(temp)
           
            close_connection(mongo_client)
            return dumps({'status': 'ok', 'templates': aux, 'code': 200})
        
        except Exception as e:
            print(e)
            return jsonify({'status': 'error', 'message': 'The user does not exist', 'code': 404})
        
    elif request.method == 'POST':
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return jsonify({'status': 'error', 'message': 'No body provided', 'code': 400})
        
        if not body:
            return jsonify({'status': 'error', 'message': 'The body of the request is empty', 'code': 400})
        
        user_id = body.get('user_id')
        if not user_id:
            return jsonify({'status': 'error', 'message': 'The user_id is required', 'code': 400})
        try:
            user = db.get_or_404(Users, user_id)
            template_data = body.get('template_data')
            if not template_data:
                return jsonify({'status': 'error', 'message': 'The template_data is required', 'code': 400})

            tech = body.get('tech')
            if not tech:
                return jsonify({'status': 'error', 'message': 'The tech is required', 'code': 400})

            tech_type = body.get('tech_type')
            if not tech_type:
                return jsonify({'status': 'error', 'message': 'The tech_type is required', 'code': 400})

            template_path = temp_creator(template_data, tech, tech_type)
            if not template_path:
                return jsonify({'status': 'error', 'message': 'The template could not be created', 'code': 500})
            
            mongo_client = get_client()
            mongo_collection = get_collection(get_db(mongo_client,"automatAPI"),"templates")

            template_ref = insert_one(mongo_collection, template_data)
            if not template_ref.acknowledged:
                close_connection(mongo_client)
                return jsonify({'status': 'error', 'message': 'The template could not be stored in the non relational Database', 'code': 500})

            template = Templates(user_id=user_id, app_name=template_data['app_name'], technology=tech, tech_type=tech_type, template_ref=str(template_ref.inserted_id))
            try:
                db.session.add(template)
                db.session.commit()
                close_connection(mongo_client)
                return jsonify({'status': 'ok', 'message': 'The template was created successfully' + template_path, 'code': 201}) # https://stackoverflow.com/questions/67785867/how-to-send-zip-file-with-send-file-flask-framework Para enviar el zip, preguntar a Luis
            except Exception as e:
                close_connection(mongo_client)
                delete_one(mongo_collection, template_ref.inserted_id)
                return jsonify({'status': 'error', 'message': 'The template could not be stored in the relational Database', 'code': 500})
        except Exception as e:
            print(e)
            return jsonify({'status': 'error', 'message': 'The user does not exist', 'code': 404})