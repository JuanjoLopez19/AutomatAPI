from flask import Flask, send_from_directory
from models.model import db
from flask_cors import CORS
from routes.templates import templates
from routes.users import users
from routes.docs import swagger_blueprint, SWAGGER_URL


api = Flask(__name__)
CORS(api)

if __name__ == "__main__":
    api.config.from_pyfile("./config.cfg")
    api.register_blueprint(templates)
    api.register_blueprint(users)
    api.register_blueprint(swagger_blueprint, url_prefix=SWAGGER_URL)
    db.init_app(api)

    @api.route("/reference/<path:path>")
    def static_dir(path):
        return send_from_directory("reference", path)

    api.run()
