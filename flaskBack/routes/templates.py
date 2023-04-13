from flask import Blueprint, jsonify, make_response, request
from models.model import db, Users, Templates, Role, Tech, TechType, Tokens
from templatesStuff.template_methods import *
from mongo_db import (
    insert_one,
    find_one,
    get_client,
    get_db,
    get_collection,
    close_connection,
    update_one,
    delete_one,
)
from bson.objectid import ObjectId

templates = Blueprint("templates", __name__, url_prefix="/templates")


@templates.route("", methods=["GET", "POST"])
def get_templates():
    """
    Method Get: Return all templates the user has access to, if user is admin return all templates
        Body: user_id
    Method Post: Create a new template
        Body: user_id, template_data, tech, tech_type
    """

    if request.method == "GET":
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return make_response(
                jsonify({"status": "error", "message": "No body provided"}), 400
            )

        if not body:
            return make_response(
                jsonify(
                    {"status": "error", "message": "The body of the request is empty"},
                    400,
                )
            )

        user_id = body.get("user_id")
        if not user_id:
            return make_response(
                jsonify({"status": "error", "message": "The user_id is required"}), 400
            )

        try:
            user = db.get_or_404(Users, user_id)
            if user["role"] == Role.admin:
                templates_list = Templates.query.all()
            else:
                templates_list = Templates.query.filter_by(user_id=user_id).all()

            if not templates_list:
                return make_response(
                    jsonify({"status": "error", "message": "No templates found"}), 204
                )

            mongo_client = get_client()
            mongo_collection = get_collection(
                get_db(mongo_client, "automatAPI"), "templates"
            )
            aux = []

            for template in templates_list:
                ref = template["template_ref"]
                temp = find_one(mongo_collection, ObjectId(ref.replace(" ", "")))
                if temp:
                    aux.append(temp)

            [template.pop("_id") for template in aux]

            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "ok",
                        "templates": aux,
                    }
                ),
                200,
            )

        except Exception as e:
            print(e.with_traceback())
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not exist",
                    }
                ),
                404,
            )

    elif request.method == "POST":
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return make_response(
                jsonify({"status": "error", "message": "No body provided"}), 400
            )

        if not body:
            return make_response(
                jsonify(
                    {"status": "error", "message": "The body of the request is empty"},
                    400,
                )
            )

        user_id = body.get("user_id")
        if not user_id:
            return make_response(
                jsonify({"status": "error", "message": "The user_id is required"}), 400
            )

        try:
            user = db.get_or_404(Users, user_id)
            template_data = body.get("template_data")
            if not template_data:
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "The template_data is required",
                        },
                        400,
                    )
                )

            template_data = json.loads(template_data)

            tech = body.get("tech")
            if not tech:
                return make_response(
                    jsonify({"status": "error", "message": "The tech is required"}), 400
                )

            tech = Tech[tech]

            tech_type = body.get("tech_type")
            if not tech_type:
                return make_response(
                    jsonify(
                        {"status": "error", "message": "The tech_type is required"}
                    ),
                    400,
                )

            tech_type = TechType[tech_type]

            template_path = temp_creator(template_data, tech, tech_type)
            if not template_path:
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "The template could not be created",
                        }
                    ),
                    500,
                )

            mongo_client = get_client()
            mongo_collection = get_collection(
                get_db(mongo_client, "automatAPI"), "templates"
            )

            template_ref = insert_one(mongo_collection, template_data)
            if not template_ref.acknowledged:
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "The template could not be stored in the non relational Database",
                        }
                    ),
                    500,
                )

            template = Templates(
                user_id=user_id,
                app_name=template_data["app_name"],
                technology=tech,
                tech_type=tech_type,
                template_ref=str(template_ref.inserted_id),
                description=template_data.get("app_description", None),
            )
            try:
                db.session.add(template)
                db.session.commit()
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "ok",
                            "message": "The template was created successfully",
                            "data": template_path,
                            "template_id": template.id
                        }
                    ),
                    201,
                )

            except Exception as e:
                close_connection(mongo_client)
                delete_one(mongo_collection, template_ref.inserted_id)
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "The template could not be stored in the relational Database",
                        }
                    ),
                    500,
                )

        except Exception as e:
            print(e.with_traceback())
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not exist",
                    }
                ),
                404,
            )


@templates.route("/<int:template_id>", methods=["GET"])
def get_template(template_id):
    """
    Method Get: Return the template with the given id
        Body: user_id
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "No body provided"}), 400
        )

    if not body:
        return make_response(
            jsonify(
                {"status": "error", "message": "The body of the request is empty"}, 400
            )
        )

    user_id = body.get("user_id")
    if not user_id:
        return make_response(
            jsonify({"status": "error", "message": "The user_id is required"}), 400
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not have access to the template",
                    }
                ),
                403,
            )

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )
        ref = template["template_ref"]
        temp = find_one(mongo_collection, ObjectId(ref.replace(" ", "")))
        if temp:
            temp.pop("_id")
        close_connection(mongo_client)
        return make_response(jsonify({"status": "ok", "template": temp}), 200)

    except Exception as e:
        print(e)
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user or the template does not exist",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/update", methods=["PUT"])
def update_template(template_id):
    """
    Method Update: Update the template with the given id with request body data
        Body: user_id, template_data, create_temp
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "No body provided"}), 400
        )

    if not body:
        return make_response(
            jsonify({"status": "error", "message": "The body of the request is empty"}),
            400,
        )

    user_id = body.get("user_id")
    create_temp = body.get("create_temp")
    if not user_id:
        return make_response(
            jsonify({"status": "error", "message": "The user_id is required"}), 400
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        template_data = body.get("template_data")
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not have access to the template",
                    }
                ),
                403,
            )

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )
        ref = template["template_ref"]

        temp = update_one(
            mongo_collection, ObjectId(ref.replace(" ", "")), template_data
        )
        if temp.acknowledged:
            setattr(template, "date_created", db.func.current_timestamp())
            db.session.add(template)
            db.session.commit()
            if create_temp:
                data = find_one(mongo_collection, ObjectId(ref.replace(" ", "")))
                data.pop("_id")
                try:
                    path = temp_creator(
                        data, template["technology"], template["tech_type"]
                    )
                    close_connection(mongo_client)
                    return make_response(
                        jsonify(
                            {
                                "status": "ok",
                                "message": "The template was updated successfully",
                                "data": path,
                            }
                        ),
                        200,
                    )
                except Exception as e:
                    close_connection(mongo_client)
                    return make_response(
                        jsonify(
                            {
                                "status": "error",
                                "message": "The template could not be created",
                            }
                        ),
                        500,
                    )

            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "ok",
                        "message": "The template was updated successfully",
                    }
                ),
                200,
            )

        else:
            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The template could not be updated",
                    }
                ),
                500,
            )

    except Exception as e:
        print("Error", e)
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user or the template does not exist",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/delete", methods=["DELETE"])
def delete_template(template_id):
    """
    Method Delete: Delete the template with the given id
        Body: user_id
    """

    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "No body provided", "code": 400}),
            400,
        )

    if not body:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The body of the request is empty",
                    "code": 400,
                }
            ),
            400,
        )

    user_id = body.get("user_id")
    if not user_id:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user_id is required",
                    "code": 400,
                }
            ),
            400,
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not have access to the template",
                    }
                ),
                403,
            )

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )

        ref = template["template_ref"]
        temp = delete_one(mongo_collection, ObjectId(ref.replace(" ", "")))
        if temp.acknowledged:
            db.session.query(Tokens).filter(Tokens.template_id == template_id).delete()
            db.session.delete(template)
            db.session.commit()
            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "ok",
                        "message": "The template was deleted successfully",
                    }
                ),
                200,
            )

        else:
            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The template could not be deleted",
                    }
                ),
                500,
            )

    except Exception as e:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user or the template does not exist",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/create", methods=["POST"])
def create_template(template_id):
    """
    Method Post: Create the template with the given id
        Body: user_id
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "No body provided"}),
            400,
        )

    if not body:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The body of the request is empty",
                }
            ),
            400,
        )

    user_id = body.get("user_id")
    if not user_id:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user_id is required",
                }
            ),
            400,
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The user does not have access to the template",
                    }
                ),
                403,
            )

        mongo_client = get_client()
        mongo_collection = get_collection(
            get_db(mongo_client, "automatAPI"), "templates"
        )
        ref = template["template_ref"]
        temp = find_one(mongo_collection, ObjectId(ref.replace(" ", "")))
        if temp:
            temp.pop("_id")
            try:
                path = temp_creator(temp, template["technology"], template["tech_type"])
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "ok",
                            "message": "The template was created successfully",
                            "data": path,
                        }
                    ),
                    200,
                )
            except Exception as e:
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "The template could not be created",
                        }
                    ),
                    500,
                )

        else:
            close_connection(mongo_client)
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "The template could not be found",
                    }
                ),
                404,
            )

    except Exception as e:
        print("Error", e)
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "The user or the template does not exist",
                }
            ),
            404,
        )
