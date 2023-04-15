from bson import ObjectId
from flask import Blueprint, jsonify, make_response
from flaskBack.mongo_db import get_client, get_collection, get_db, delete_many
from models.model import db, Users, Templates, Tokens

users = Blueprint("users", __name__, url_prefix="/users")


@users.route("/<int:user_id>/delete", methods=["DELETE"])
def get_templates(user_id):
    """
    Deletes a user from the database and his templates with it.
    """

    try:
        user = db.get_or_404(Users, user_id)
        templates = Templates.query.filter_by(user_id=user.id)

        aux = []
        for template in templates:
            aux.append(template.template_ref)
            # db.session.delete(template)

        print(aux)

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )
        
        aux = [ObjectId(x.replace(" ", "")) for x in aux]
        print(aux)
        
        temp = delete_many(mongo_collection, {"_id": {"$in": aux}})
        if (not temp.acknowledged):
            return make_response(
                jsonify({"message": "Error deleting templates", "status": "error"}), 500
            )

        # user.delete()
        # db.session.commit()
        return make_response(
            jsonify({"message": "User deleted", "status": "success"}), 200
        )
    except Exception as e:
        print(e.with_traceback("User not found"))
        return make_response(
            jsonify({"message": "User not found", "status": "error"}), 404
        )
