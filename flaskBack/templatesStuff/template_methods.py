import json
import os
import secrets
import shutil
import sys
import uuid
from cookiecutter import exceptions
from cookiecutter.main import cookiecutter
sys.path.append("..")

from models.model import Tech, TechType
from templatesStuff.aux_data import (django_test_app, django_test_service,
                                     express_test_app, express_test_service,
                                     flask_test_app, flask_test_service)
from templatesStuff.file_management import *


def temp_creator(
    template_args: dict = None, tech: Tech = None, type: TechType = None
) -> str:
    """
    @param: template_args -> Dictionary with the arguments to create the template
    @param: tech -> The tecnology of the template
    @param: type -> The type of the template

    @return: The path to the zip file that contains the filled template

    This function is the one that calls the cookiecutter function to create the template
    and returns the path to the zip file, to the main rutine
    """

    # Get the default config from the json file
    DEFAULT_CONFIG = get_default_config()

    # Set the tech and type to the template_args dict

    template_args["tecnology"] = tech
    template_args["type"] = type

    # Statics paths for the main template and the output path
    cookiecutter_template_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["tecnology_args"][
            template_args.get("tecnology")
        ][template_args.get("type")]["template_path"]
    )
    output_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["output_path"]
    )

    # Set the values to the dictionary that will be used to create the template
    args = DEFAULT_CONFIG["cookiecutter"]["tecnology_args"][
        template_args.get("tecnology")
    ][template_args.get("type")]
    args["app_folder_name"] = f" {template_args.get('app_name')}_{str(uuid.uuid4())}"
    for key, value in template_args.items():
        if template_args["type"] == "flask" and key == "secrets":
            args[key] = secrets.token_hex(16)
        else:
            args[key] = value

    # Get the endpoints from the template_args dict and delete it from the dict to avoid errors
    endpoints = template_args["endpoints"]
    if template_args["tecnology"] == "django":
        args.update(
            {
                "endpoints": {
                    "list": [
                        {
                            "endpoint_name": x.get("endpoint_name"),
                            "endpoint_url": x.get("endpoint_url"),
                            "methods": x.get("methods"),
                        }
                        for x in endpoints
                    ]
                }
            }
        )
    elif template_args["tecnology"] == "flask":
        args.update(
            {
                "endpoints": {
                    "list": [
                        {
                            "endpoint_url": x.get("endpoint_url"),
                            "methods": x.get("methods"),
                        }
                        for x in endpoints
                    ]
                }
            }
        )
    else:
        args.update(
            {
                "endpoints": {
                    "list": [
                        {
                            "endpoint_url": x.get("endpoint_url"),
                            "method": x.get("method"),
                        }
                        for x in endpoints
                    ]
                }
            }
        )

    # If not exists, create the output path
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    # Create the cookiecutter.json file in the template path
    cookiecutteJsonFile = add_base_path(cookiecutter_template_path, "cookiecutter.json")
    with open(cookiecutteJsonFile, "w") as f:
        json.dump(args, f)

    # Create the main template
    try:
        template_path = cookiecutter(
            cookiecutter_template_path,
            no_input=True,
            extra_context=args,
            output_dir=output_path,
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args["app_folder_name"] = args["app_folder_name"] + str(uuid.uuid4())
        cookiecutter(
            cookiecutter_template_path,
            no_input=True,
            extra_context=args,
            output_dir=output_path,
        )

    # Adding additional files to the template
    if template_args.get("tecnology") == "flask":  # Flask template branch
        # Flask web app branch and use blueprints
        if (
            template_args.get("type") == "app_web"
            and template_args.get("use_bp") == "yes"
        ):
            for bp in template_args.get("bp_list").get("list"):
                create_blueprint(
                    bp,
                    "{}/blueprints".format(template_path),
                    template_args.get("tecnology"),
                    template_args.get("type"),
                )  # Create the blueprints and added to the folder
        for endpoint in endpoints:
            endpoint_creator(
                endpoint,
                "{}/{}.py".format(template_path, args.get("app_name")),
                template_args.get("tecnology"),
                "services",
            )  # Create the endpoints and added to the file

        # If the user wants to handle the 404 error
        if template_args.get("handle_404"):
            # Add the 404 handler to the file
            add_404("{}/{}.py".format(template_path, args.get("app_name")))

        add_app_run(
            args,
            "{}/{}.py".format(template_path, args.get("app_name")),
            DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["flask_app_run_path"],
        )  # Add the app.run() to the file

    elif template_args.get("tecnology") == "django":  # Django template branch
        # If the user wants to create sub apps
        if template_args.get("sub_apps").get("apps"):
            for app in template_args.get("sub_apps").get("apps"):
                for key, value in app.items():
                    value.update({"subapp_name": key})
                    # Create the sub apps and added to the folder
                    create_sub_app(value, template_path, template_args.get("type"))
        for endpoint in endpoints:
            endpoint_creator(
                endpoint,
                "{}/{}/views.py".format(template_path, args.get("app_name")),
                template_args.get("tecnology"),
                "services",
            )

    elif template_args.get("tecnology") == "express":  # Express template branch
        # If the user wants to create controllers
        if template_args.get("use_controllers") == "yes":
            for controller in template_args.get("controllers_list").get("list"):
                create_controllers(
                    controller,
                    template_path,
                    template_args.get("tecnology"),
                    template_args.get("type"),
                    template_args.get("strict"),
                )  # Create the controllers and added to the folder
        for endpoint in endpoints:
            endpoint["handler_type"] = "app"
            endpoint_creator(
                endpoint,
                "{}/{}.js".format(template_path, args.get("app_name")),
                template_args.get("tecnology"),
                "services",
            )  # Create the endpoints and added to the file

        # If the app is a web app
        with open("{}/{}.js".format(template_path, args.get("app_name")), "a+") as f:
            # Add the app ending to the file
            with open(
                "{}/app_ending.js".format(
                    add_base_path(
                        DEFAULT_CONFIG.get("cookiecutter")
                        .get("aux_stuff")
                        .get("app_ending")
                    )
                ),
                "r",
            ) as f2:
                f.write(f2.read())

    # Compress the template and delete the temp files
    path = compress_api(template_path, args["app_folder_name"])
    if path:
        key = upload_to_S3(path, args["app_folder_name"])
        if key:
            remove_temp_files(output_path)
            return key
    else:
        return None
    #return path


def endpoint_creator(
    endpoint_args: dict = None,
    main_template_path: str = None,
    endpoint_type: str = None,
    endpoint_use: str = None,
) -> str:
    """
    @param: endpoint_args -> Dictionary with the arguments to create the endpoint
    @param: main_template_path -> Path to the main template to add the endpoint
    @param: endpoint_type -> Type of endpoint to create
    @param: endpoint_use -> Use of the endpoint (services or web)

    @return: None
    """

    DEFAULT_CONFIG = get_default_config()  # Get the default config

    # Get the config for the endpoint type
    config = DEFAULT_CONFIG["cookiecutter"]["endpoints_args"][endpoint_type]
    # Get the path to the template and the output path
    output_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["output_path"]
    )
    temp_path = add_base_path(config["template_path"])

    # Set the arguments for the template
    config["file_folder_name"] = (
        endpoint_args["endpoint_name"] + "_" + str(uuid.uuid4())
    )
    config["file_name"] = endpoint_args["endpoint_name"]
    if endpoint_type == "flask" or endpoint_type == "express":
        config["endpoint_use"] = endpoint_use

    for key, value in endpoint_args.items():
        if endpoint_type == "express" and key == "handler_type" and value == "":
            config[key] = "app"
        else:
            config[key] = value

    # Create the cookiecutter.json file
    cookiecutteJsonFile = add_base_path(temp_path, "cookiecutter.json")
    with open(cookiecutteJsonFile, "w") as f:
        json.dump(config, f)

    # Create the template
    try:
        aux_path = cookiecutter(
            temp_path, no_input=True, extra_context=config, output_dir=output_path
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        config["file_folder_name"] = config["file_folder_name"] + str(uuid.uuid4())
        aux_path = cookiecutter(
            temp_path, no_input=True, extra_context=config, output_dir=output_path
        )

    # Add the endpoint to the main template
    try:
        if endpoint_type == "flask":  # If the endpoint is for flask
            with open(main_template_path, "a+") as f:
                with open("{}/{}.py".format(aux_path, config["file_name"]), "r") as f2:
                    f.write(f2.read())
        elif endpoint_type == "express":  # If the endpoint is for express
            with open(main_template_path, "a+") as f:
                with open("{}/{}.js".format(aux_path, config["file_name"]), "r") as f2:
                    f.write(f2.read())
        elif endpoint_type == "django":  # If the endpoint is for django
            with open(main_template_path, "a+") as f:
                with open("{}/{}.py".format(aux_path, config["file_name"]), "r") as f2:
                    f.write(f2.read())

        remove_temp_files(aux_path)  # Remove the temp files

    except FileNotFoundError as e:
        print(e)


def add_app_run(
    app_run_args: dict = None, main_template_path: str = None, template_path: str = None
) -> None:
    """
    @param: app_run_args -> Dictionary with the arguments to create the template
    @param: main_template_path -> Path to the main template to add the app_run
    @param: template_path -> Path to the template to create the app_run

    @return: None
    """

    DEFAULT_CONFIG = get_default_config()  # Get the default config

    # Get the path to the template and the output path
    output_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["output_path"]
    )
    app_run_args["run_folder_name"] = app_run_args["app_name"] + str(uuid.uuid4())
    template_path = add_base_path(template_path)
    # Create the cookiecutter.json file
    cookiecutteJsonFile = os.path.join(template_path, "cookiecutter.json")
    with open(cookiecutteJsonFile, "w") as f:
        json.dump(app_run_args, f)

    # Create the template
    try:
        run_path = cookiecutter(
            template_path,
            no_input=True,
            extra_context=app_run_args,
            output_dir=output_path,
        )
    except exceptions.OutputDirExistsException:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        app_run_args["run_folder_name"] = app_run_args["run_folder_name"] + str(
            uuid.uuid4()
        )
        run_path = cookiecutter(
            template_path,
            no_input=True,
            extra_context=app_run_args,
            output_dir=output_path,
        )

    # Add the app_run to the main template
    try:
        with open(main_template_path, "a+") as f:
            with open("{}/{}.py".format(run_path, app_run_args["app_name"]), "r") as f2:
                f.write(f2.read())

        remove_temp_files(run_path)  # Remove the temp files

    except FileNotFoundError as e:
        print(e)


def create_blueprint(
    args: dict = None,
    main_template_path: str = None,
    endpoint_type: str = None,
    endpoint_use: str = None,
) -> None:
    """
    @param: args -> Dictionary with the arguments to create the blueprint template
    @param: main_template_path -> Path to the main template to add the blueprint
    @param: endpoint_type: Type of endpoint to create
    @param: endpoint_use: Use of the endpoint to create

    @return: None
    """

    DEFAULT_CONFIG = get_default_config()  # Get the default config

    # Get the path to the template
    blueprint_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["blueprints"]
    )

    # Create the auxiliar dictionary for the blueprint
    aux_dict = {
        "bp_folder_name": list(args.keys())[0] + "_" + str(uuid.uuid4()),
        "bp_name": list(args.keys())[0],
    }

    # Create the cookiecutter.json file
    blueprint_Json = os.path.join(blueprint_path, "cookiecutter.json")
    with open(blueprint_Json, "w") as f:
        json.dump(aux_dict, f)

    # Create the blueprint
    try:
        template = cookiecutter(
            blueprint_path,
            no_input=True,
            extra_context=aux_dict,
            output_dir=main_template_path,
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        aux_dict["bp_folder_name"] = aux_dict["bp_folder_name"] + str(uuid.uuid4())
        template = cookiecutter(
            blueprint_path,
            no_input=True,
            extra_context=aux_dict,
            output_dir=main_template_path,
        )

    # Add the endpoints to the blueprint
    bp_endpoints = list(args.values())
    for endpoints in bp_endpoints:
        for endpoint in endpoints:
            endpoint["bp_name"] = aux_dict["bp_name"]
            endpoint_creator(
                endpoint,
                "{}/{}.py".format(template, aux_dict["bp_name"]),
                endpoint_type,
                endpoint_use,
            )  # Create the endpoint

    # Move the blueprint to the main template folder
    shutil.move("{}/{}.py".format(template, aux_dict["bp_name"]), main_template_path)

    remove_temp_files(template)  # Remove the temp files


def add_404(main_template_path: str = None) -> None:
    """
    @param: main_template_path -> Path to the base template

    @return: None
    """

    with open(main_template_path, "a+") as f:
        f.write(
            """
@app.errorhandler(404)
def page_not_found(e):  
    return render_template('404.html')

"""
        )


def create_controllers(
    controller_args: dict = None,
    main_template_path: str = None,
    endpoint_type: str = None,
    endpoint_use: str = None,
    strict_mode: str = None,
) -> None:
    """
    @param: args -> Dictionary with the arguments to create the controller template
    @param: template_path -> Path to the base folder
    @param: endpoint_type -> Type of endpoint to create
    @param: endpoint_use -> Use of the endpoint to create
    @param: strict_mode -> Strict mode for the controller

    @return: None
    """

    DEFAULT_CONFIG = get_default_config()  # Get the default config
    # Get the path to the template
    controller_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["controllers"]
    )

    # Create the auxiliar dictionary for the controller
    aux_dict = {
        "controller_folder_name": "{}_{}".format(
            list(controller_args.keys())[0], str(uuid.uuid4())
        ),
        "controller_name": list(controller_args.keys())[0],
        "strict": strict_mode,
    }

    # Create the cookiecutter.json file
    controller_Json = os.path.join(controller_path, "cookiecutter.json")
    with open(controller_Json, "w") as f:
        json.dump(aux_dict, f)

    # Create the controller template
    try:
        template = cookiecutter(
            controller_path,
            no_input=True,
            extra_context=aux_dict,
            output_dir=main_template_path + "/controllers",
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        aux_dict["controller_folder_name"] = aux_dict["controller_folder_name"] + str(
            uuid.uuid4()
        )
        template = cookiecutter(
            controller_path,
            no_input=True,
            extra_context=aux_dict,
            output_dir=main_template_path + "/controllers",
        )

    # Get the endpoints for the controller
    controller_endpoints = list(controller_args.values())
    for endpoints in controller_endpoints:
        for endpoint in endpoints:
            endpoint["endpoint_name"] = aux_dict["controller_name"]
            endpoint["handler_type"] = aux_dict.get("controller_name")
            endpoint_creator(
                endpoint,
                "{}/{}.js".format(template, aux_dict["controller_name"]),
                endpoint_type,
                endpoint_use,
            )  # Create the endpoint

    with open(template + "/" + aux_dict.get("controller_name") + ".js", "a+") as f:
        f.write("\n")
        f.write("""module.exports = {}""".format(aux_dict.get("controller_name")))

    shutil.move(
        "{}/{}.js".format(template, aux_dict["controller_name"]),
        "{}/controllers".format(main_template_path),
    )  # Move the controller to the main template folder

    remove_temp_files(template)  # Remove the temp files


def add_app_listen(args: dict = None, main_template_path: str = None) -> None:
    """
    @param: args -> Dictionary with the arguments to create the app_listen template
    @param: main_template_path -> Path to the main template to add the app_listen

    @return: None
    """

    DEFAULT_CONFIG = get_default_config()  # Get the default config

    # Get the output path and the path to the template
    output_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["output_path"]
    )
    aux_path = add_base_path(DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["app_listen"])

    args["listen_folder_name"] = "{}_{}".format(args.get("app_name"), str(uuid.uuid4()))
    args["listen_name"] = args.get("app_name")

    # Create the cookiecutter.json file
    listen_Json = os.path.join(aux_path, "cookiecutter.json")
    with open(listen_Json, "w") as f:
        json.dump(args, f)

    # Create the controller template
    try:
        template = cookiecutter(
            aux_path, no_input=True, extra_context=args, output_dir=output_path
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args["listen_folder_name"] = args["listen_folder_name"] + str(uuid.uuid4())
        template = cookiecutter(
            aux_path, no_input=True, extra_context=args, output_dir=output_path
        )

    with open(main_template_path, "a+") as f:
        # Add the app_listen to the main template
        with open("{}/{}.js".format(template, args.get("listen_name")), "r") as f2:
            f.write(f2.read())

    remove_temp_files(template)  # Remove the temp files


def create_sub_app(
    subapp_args: dict = None, main_template_path: str = None, type: str = None
) -> None:
    """
    @param: subapp_args -> Dictionary with the arguments to create the sub app template
    @param: main_template_path -> Path to the base folder to add the sub app
    @param: type -> Type of sub app to create

    @return: None
    """
    DEFAULT_CONFIG = get_default_config()  # Get the default config

    # Get the path to the template
    aux_path = add_base_path(
        DEFAULT_CONFIG["cookiecutter"]["aux_stuff"]["sub_app_{}".format(type)][
            "template_path"
        ]
    )
    subapp_args["subapp_folder_name"] = subapp_args.get("subapp_name")

    # Create the cookiecutter.json file
    subapp_json = os.path.join(aux_path, "cookiecutter.json")
    with open(subapp_json, "w") as f:
        json.dump(subapp_args, f)

    # Create the subapp template
    try:
        temp_path = cookiecutter(
            aux_path,
            no_input=True,
            extra_context=subapp_args,
            output_dir=main_template_path + "/subapps",
        )
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        subapp_args["subapp_folder_name"] = subapp_args["subapp_folder_name"] + str(
            uuid.uuid4()
        )
        temp_path = cookiecutter(
            aux_path,
            no_input=True,
            extra_context=subapp_args,
            output_dir=main_template_path + "/subapps",
        )

    if (
        type == "app_web"
    ):  # If the template is a web app, add the endpoint to the subapp views.py
        endpoint_creator(subapp_args, "{}/views.py".format(temp_path), "django")


if __name__ == "__main__":
    temp_creator(flask_test_service, "flask", "services")
    temp_creator(flask_test_app, "flask", "app_web")
    temp_creator(express_test_service, "express", "services")
    temp_creator(express_test_app, "express", "app_web")
    temp_creator(django_test_service, "django", "services")
    temp_creator(django_test_app, "django", "app_web")
