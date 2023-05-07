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
    Get: Return all templates the user has access to, if user is admin return all templates
        Body:
            user_id: The id of the user to be deleted.
    Post: Create a new template
        Body:
            user_id: The id of the user to be deleted.
            template_data: The data of the template to be created
            tech: The technology of the template to be created
            tech_type: The use of the technology of the template to be created
            aws_key_cert: The certificate key of the aws account to be used (optional)
            aws_key_key: The private key of the aws account to be used (optional)
    """

    if request.method == "GET":
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return make_response(
                jsonify({"status": "error", "message": "T_BAD_REQ"}), 400
            )

        if not body:
            return make_response(
                jsonify(
                    {"status": "error", "message": "T_BODY_EMPTY"},
                    400,
                )
            )

        user_id = body.get("user_id")
        if not user_id:
            return make_response(
                jsonify({"status": "error", "message": "T_USER_ID_REQ"}), 400
            )

        try:
            user = db.get_or_404(Users, user_id)
            if user["role"] == Role.admin:
                templates_list = Templates.query.all()
            else:
                templates_list = Templates.query.filter_by(user_id=user_id).all()

            if not templates_list:
                return make_response(
                    jsonify({"status": "error", "message": "T_TEMPLATES_NOT_FOUND"}),
                    204,
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
                        "message": "T_TEMPLATES_FOUND",
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
                        "message": "T_USER_NOT_FOUND",
                    }
                ),
                404,
            )

    elif request.method == "POST":
        try:
            body = dict(request.get_json(force=True))
        except Exception:
            return make_response(
                jsonify({"status": "error", "message": "T_BAD_REQ"}), 400
            )

        if not body:
            return make_response(
                jsonify(
                    {"status": "error", "message": "T_BODY_EMPTY"},
                    400,
                )
            )

        user_id = body.get("user_id")
        if not user_id:
            return make_response(
                jsonify({"status": "error", "message": "T_USER_ID_REQ"}), 400
            )

        try:
            user = db.get_or_404(Users, user_id)
            template_data = body.get("template_data")
            if not template_data:
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "T_TEMPLATE_DATA_REQ",
                        },
                        400,
                    )
                )

            template_data = json.loads(template_data)

            tech = body.get("tech")
            if not tech:
                return make_response(
                    jsonify({"status": "error", "message": "T_TECH_REQ"}), 400
                )

            tech = Tech[tech]

            tech_type = body.get("tech_type")
            if not tech_type:
                return make_response(
                    jsonify(
                        {"status": "error", "message": "T_TECH_TYPE_REQ"},
                    ),
                    400,
                )

            tech_type = TechType[tech_type]

            cert_key = body.get("aws_key_cert", None)
            private_key = body.get("aws_key_key", None)

            template_path = temp_creator(
                template_data, tech, tech_type, cert_key, private_key
            )
            if not template_path:
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "T_TEMPLATE_CREATION_ERROR",
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
                            "message": "T_TEMPLATE_STORE_ERROR",
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
                            "message": "T_TEMPLATE_CREATED",
                            "data": template_path,
                            "template_id": template.id,
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
                            "message": "T_TEMPLATE_STORE_ERROR",
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
                        "message": "T_USER_NOT_FOUND",
                    }
                ),
                404,
            )


@templates.route("/<int:template_id>", methods=["GET"])
def get_template(template_id):
    """
    Get: Return the template with the given id
        Body: 
            user_id: The id of the user to be deleted.
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(jsonify({"status": "error", "message": "T_BAD_REQ"}), 400)

    if not body:
        return make_response(
            jsonify({"status": "error", "message": "T_BODY_EMPTY"}, 400)
        )

    user_id = body.get("user_id")
    if not user_id:
        return make_response(
            jsonify({"status": "error", "message": "T_USER_ID_REQ"}), 400
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "T_UNAUTHORIZED",
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
        return make_response(
            jsonify({"status": "ok", "template": temp, "messages": "T_TEMPLATE_FOUND"}),
            200,
        )

    except Exception as e:
        print(e)
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_NOT_FOUND",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/update", methods=["PUT"])
def update_template(template_id):
    """
    Update: Update the template with the given id with request body data
        Body: 
            user_id: The id of the user to be deleted.
            template_data: The data of the template to be created
            tech_type: The use of the technology of the template to be created
            aws_key_cert: The certificate key of the aws account to be used (optional)
            aws_key_key: The private key of the aws account to be used (optional)
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(jsonify({"status": "error", "message": "T_BAD_REQ"}), 400)

    if not body:
        return make_response(
            jsonify({"status": "error", "message": "T_BODY_EMPTY"}),
            400,
        )

    user_id = body.get("user_id")

    if not user_id:
        return make_response(
            jsonify({"status": "error", "message": "T_USER_ID_REQ"}), 400
        )

    tech_type = body.get("tech_type")
    if not tech_type:
        return make_response(
            jsonify({"status": "error", "message": "T_TECH_TYPE_REQ"}), 400
        )

    try:
        user = db.get_or_404(Users, user_id)
        template = db.get_or_404(Templates, template_id)
        template_data = body.get("template_data")
        if not template_data:
            return make_response(
                jsonify({"status": "error", "message": "T_TEMPLATE_DATA_REQ"}),
                400,
            )

        template_data = json.loads(template_data)
        if user["role"] != Role.admin and template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "T_UNAUTHORIZED",
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
            setattr(template, "last_updated", db.func.current_timestamp())
            setattr(template, "app_name", template_data["app_name"])
            setattr(template, "description", template_data["app_description"])
            setattr(template, "tech_type", tech_type)

            db.session.add(template)
            db.session.commit()

            data = find_one(mongo_collection, ObjectId(ref.replace(" ", "")))
            data.pop("_id")
            try:
                cert_key = body.get("aws_key_cert", None)
                private_key = body.get("aws_key_key", None)
                path = temp_creator(
                    data, template.technology, template.tech_type, cert_key, private_key
                )
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "ok",
                            "message": "T_TEMPLATE_CREATED",
                            "data": path,
                        }
                    ),
                    200,
                )
            except Exception as e:
                print(e.with_traceback())
                close_connection(mongo_client)
                return make_response(
                    jsonify(
                        {
                            "status": "error",
                            "message": "T_TEMPLATE_NOT_CREATED",
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
                        "message": "T_TEMPLATE_NOT_UPDATED",
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
                    "message": "T_NOT_FOUND",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/delete", methods=["DELETE"])
def delete_template(template_id):
    """
    Delete: Delete the template with the given id
        Body:
            user_id: The id of the user to be deleted.
    """

    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "T_BAD_REQ", "code": 400}),
            400,
        )

    if not body:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_BODY_EMPTY",
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
                    "message": "T_USER_ID_REQ",
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
                        "message": "T_UNAUTHORIZED",
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
                        "message": "T_TEMPLATE_DELETED",
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
                        "message": "T_TEMPLATE_NOT_DELETED",
                    }
                ),
                500,
            )

    except Exception as e:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_NOT_FOUND",
                }
            ),
            404,
        )


@templates.route("/<int:template_id>/create", methods=["POST"])
def create_template(template_id):
    """
    Post: Create the template with the given id
        Body:
            user_id: The id of the user to be deleted.
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


@templates.route("/getTemplateConfig", methods=["POST"])
def get_config():
    """
    Post: Return the template config with the given id
        Body:
            user_id: The id of the user to be deleted.
            template_id: The id of the template to be created
    """
    try:
        body = dict(request.get_json(force=True))
    except Exception:
        return make_response(
            jsonify({"status": "error", "message": "T_BAD_REQ"}),
            400,
        )

    if not body:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_BODY_REQ",
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
                    "message": "T_USER_ID_REQ",
                }
            ),
            400,
        )
    template_id = body.get("template_id")
    if not template_id:
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_TEMPLATE_ID_REQ",
                }
            ),
            400,
        )

    try:
        template = db.get_or_404(Templates, template_id)
        if template["user_id"] != user_id:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "T_UNAUTHORIZED",
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
            return make_response(
                jsonify(
                    {
                        "status": "ok",
                        "message": "T_FOUND",
                        "data": {
                            "technology": str(template["technology"]),
                            "tech_type": str(template["tech_type"]),
                            "template_args": temp,
                        },
                    }
                ),
                200,
            )
        else:
            return make_response(
                jsonify(
                    {
                        "status": "error",
                        "message": "T_NOT_FOUND",
                    }
                ),
                404,
            )
    except Exception as e:
        print(e.with_traceback())
        return make_response(
            jsonify(
                {
                    "status": "error",
                    "message": "T_NOT_FOUND",
                }
            ),
            404,
        )
