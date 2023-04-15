from flask import Flask
from models.model import db
from flask_cors import CORS
from routes.templates import templates
from routes.users import users

api = Flask(__name__)
CORS(api)

if __name__ == '__main__':
    api.config.from_pyfile('./config.cfg')
    api.register_blueprint(templates)
    api.register_blueprint(users)
    db.init_app(api)

    with api.test_request_context():
        print(api.url_map)
        
    api.run() 