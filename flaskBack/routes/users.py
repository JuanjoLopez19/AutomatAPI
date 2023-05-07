from bson import ObjectId
from flask import Blueprint, jsonify, make_response
from flaskBack.mongo_db import get_client, get_collection, get_db, delete_many
from models.model import db, Users, Templates, Tokens

users = Blueprint("users", __name__, url_prefix="/users")


@users.route("/<int:user_id>/delete", methods=["DELETE"])
def get_templates(user_id):
    """
    Delete: Delete a user from the database and his templates with it.
        Query Parameters:
            user_id: The id of the user to be deleted.
    """

    try:
        user = db.get_or_404(Users, user_id)
        templates = Templates.query.filter_by(user_id=user.id)

        aux = []
        for template in templates:
            aux.append(template.template_ref)
            db.session.delete(template)

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )

        aux = [ObjectId(x.replace(" ", "")) for x in aux]

        temp = delete_many(mongo_collection, {"_id": {"$in": aux}})
        if not temp.acknowledged:
            return make_response(
                jsonify({"message": "T_INTERNAL_SERVER_ERROR", "status": "error"}), 500
            )

        db.session.delete(user)
        db.session.commit()
        return make_response(
            jsonify({"message": "T_USER_DELETED", "status": "success"}), 200
        )
    except Exception as e:
        print(e.with_traceback("User not found"))
        return make_response(
            jsonify({"message": "T_USER_FOUND", "status": "error"}), 404
        )
