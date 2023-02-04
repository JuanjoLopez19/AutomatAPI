import json,shutil,os,uuid,secrets,pprint
from cookiecutter.main import cookiecutter
from cookiecutter import exceptions
from aux_data import * 
from file_management import *

def temp_creator(template_args: dict = None, tech:str = None, type:str = None) -> str:

    """
        @param: template_args: Dictionary with the arguments to create the template 

        @return: The path to the zip file that contains the filled template

        This function is the one that calls the cookiecutter function to create the template 
        and returns the path to the zip file, to the main rutine
    """
    # Get the default config from the json file
    DEFAULT_CONFIG = get_default_config()

    # Set the tech and type to the template_args dict
    template_args['tecnology']=tech
    template_args['type']=type

    # Statics paths for the main template and the output path
    cookiecutter_template_path = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args.get('tecnology')][template_args.get('type')]['template_path']
    output_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['output_path']

    # Set the values to the dictionary that will be used to create the template
    if template_args['tecnology'] == 'flask': # Flask template branch
        args = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args.get('tecnology')][template_args.get('type')]
        args['app_folder_name'] = template_args['app_name'] + '_' + str(uuid.uuid4())
        for key, value in template_args.items():
            if key == 'secrets':
                args[key] = secrets.token_hex(16)
            else:
                args[key] = value
    elif template_args['tecnology'] == 'django': # Django template branch
        args = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args.get('tecnology')][template_args.get('type')]
        args['app_folder_name'] = template_args['app_name'] + '_' + str(uuid.uuid4())
        for key, value in template_args.items():
            args[key] = value
    elif template_args['tecnology'] == 'express': # Express template branch
        args = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args.get('tecnology')][template_args.get('type')]
        args['app_folder_name'] = template_args['app_name'] + '_' + str(uuid.uuid4())
        for key, value in template_args.items():
            args[key] = value

    # Get the endpoints from the template_args dict and delete it from the dict to avoid errors
    endpoints = template_args['endpoints']
    if template_args['tecnology'] == 'django':
        args.update({'endpoints':{'list':[{"endpoint_name":x.get('endpoint_name'), "endpoint_url":x.get('endpoint_url')} for x in endpoints]}})
    else:
        args.pop('endpoints')

    # If not exists, create the output path
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    # Create the cookiecutter.json file in the template path 
    cookiecutteJsonFile = os.path.join(cookiecutter_template_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(args, f)

    # Create the main template
    try:
        template_path = cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['app_folder_name'] = args['app_folder_name'] + str(uuid.uuid4())
        cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
    
    # Adding additional files to the template
    if template_args.get('tecnology') == 'flask': # Flask template branch
        if template_args.get('type') == 'app_web' and template_args.get('use_bp') == 'yes': # Flask web app branch and use blueprints
            for bp in template_args.get('bp_list').get('list'):
                create_blueprint(bp, template_path+'/blueprints', template_args.get('tecnology'), template_args.get('type')) # Create the blueprints and added to the folder
        for endpoint in endpoints: 
            endpoint_creator(endpoint, template_path+'/'+args['app_name']+'.py', template_args.get('tecnology'), 'services') # Create the endpoints and added to the file

        if template_args.get('handle_404'): # If the user wants to handle the 404 error
            add_404(template_path+'/'+args.get('app_name')+'.py') # Add the 404 handler to the file

        add_app_run(args,template_path+'/'+args.get('app_name')+'.py', DEFAULT_CONFIG['cookiecutter']['aux_stuff']['flask_app_run_path']) # Add the app.run() to the file

    elif template_args.get('tecnology') == 'django': # Django template branch
        if template_args.get('sub_apps').get('apps'): # If the user wants to create sub apps
            for app in template_args.get('sub_apps').get('apps'):
                for key, value in app.items():
                    value.update({'subapp_name':key})
                    create_sub_app(value, template_path, DEFAULT_CONFIG['cookiecutter']['aux_stuff']['sub_app']['template_path']) # Create the sub apps and added to the folder
        for endpoint in endpoints:
            endpoint_creator(endpoint, template_path+'/'+args.get('app_name')+'/views.py', template_args.get('tecnology'), 'services')

    elif template_args.get('tecnology') == 'express': # Express template branch
        if template_args.get('use_controllers') == 'yes': # If the user wants to create controllers
            for controller in template_args.get('controllers_list').get('list'):
                create_controllers(controller, template_path, template_args.get('tecnology'), template_args.get('type'), template_args.get('strict')) # Create the controllers and added to the folder
        for endpoint in endpoints:
            endpoint['handler_type']="app"
            endpoint_creator(endpoint, template_path+'/'+args.get('app_name')+'.js', template_args.get('tecnology'), 'services') # Create the endpoints and added to the file

        if template_args.get('type') == "services": # If the app is a services app
            add_app_listen(args, template_path+'/'+args.get('app_name')+'.js', DEFAULT_CONFIG['cookiecutter']['aux_stuff']['app_listen'], output_path ) # Add the app.listen() to the file
        else:
            with open(template_path+'/'+args.get('app_name')+'.js', 'a+') as f: # If the app is a web app
                with open(DEFAULT_CONFIG.get('cookiecutter').get('aux_stuff').get('app_ending')+"/app_ending.js", 'r') as f2: # Add the app ending to the file
                    f.write(f2.read())

    # Compress the template and delete the temp files
    #path = compress_api(template_path, args['app_name'], args['app_name'])
    #return path
    
    

def endpoint_creator(template_args: dict = None, template_path:str = None, endpoint_type:str = None, endpoint_use:str = None) -> str:

    """
        @param: template_args: Dictionary with the arguments to create the template
        @param: template_path: Path to the template to use
        @param: endpoint_type: Type of endpoint to create

        @return: For the moment nothing is returned
    """

    DEFAULT_CONFIG = get_default_config()

    config =  DEFAULT_CONFIG['cookiecutter']['endpoints_args'][endpoint_type]
    output_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['output_path']
    temp_path = config['template_path']

    if endpoint_type == 'flask':
        config['file_folder_name'] = template_args['endpoint_name'] + '_' + str(uuid.uuid4())
        config['file_name'] = template_args['endpoint_name']
        config['endpoint_use'] = endpoint_use 
        for key, value in template_args.items():
            config[key] = value
    elif endpoint_type == 'django':
        config['file_folder_name'] = template_args['endpoint_name'] + '_' + str(uuid.uuid4())
        config['file_name'] = template_args['endpoint_name']
        for key, value in template_args.items():
            config[key] = value
    elif endpoint_type == 'express':
        config['file_folder_name'] = template_args['endpoint_name'] + '_' + str(uuid.uuid4())
        config['file_name'] = template_args['endpoint_name']
        config['endpoint_use'] = endpoint_use 
        for key, value in template_args.items():
            if key == 'handler_type' and value == '':
                config[key] = 'app'
            else:
                config[key] = value
                
    cookiecutteJsonFile = os.path.join(temp_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(config, f)
  
    try:
        aux_path = cookiecutter(temp_path, no_input=True, extra_context=config, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        config['file_folder_name'] = config['file_folder_name'] + str(uuid.uuid4())
        aux_path = cookiecutter(temp_path, no_input=True, extra_context=config, output_dir=output_path)

    try:
        if(endpoint_type == 'flask'):
            with open(template_path, 'a+') as f:
                with open(aux_path+"/"+config['file_name']+'.py', 'r') as f2:
                    f.write(f2.read())
        elif endpoint_type == 'express':
            with open(template_path, 'a+') as f:
                with open(aux_path+"/"+config['file_name']+'.js', 'r') as f2:
                    f.write(f2.read())
        elif endpoint_type == 'django':
            with open(template_path, 'a+') as f:
                with open(aux_path+"/"+config['file_name']+'.py', 'r') as f2:
                    f.write(f2.read())

        remove_temp_files(aux_path)
    except FileNotFoundError as e:
        print(e)



def add_app_run(args: dict = None, template_path: str = None, aux_path: str = None) -> None:

    """
        @param: args: Dictionary with the arguments to create the template
        @param: template_path: Path to the template to use
    """
    DEFAULT_CONFIG = get_default_config()

    output_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['output_path']
    args['run_folder_name'] = args['app_name']+ str(uuid.uuid4())
    cookiecutteJsonFile = os.path.join(aux_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(args, f)

    try:
        run_path = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['run_folder_name'] = args['run_folder_name'] + str(uuid.uuid4())
        run_path = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)
    
    try:
        with open(template_path, 'a+') as f:
            with open(run_path+"/"+args['app_name']+'.py', 'r') as f2:
                f.write(f2.read())

        remove_temp_files(run_path)
    except FileNotFoundError as e:
        print(e)



def create_blueprint(args: dict = None, template_path: str = None, endpoint_type:str = None, endpoint_use:str = None) -> None:

    """
        @param: args: Dictionary with the arguments to create the bluepritn template
        @param: template_path: Path to the base folder
        @param: endpoint_type: Type of endpoint to create
        @param: endpoint_use: Use of the endpoint to create

        @return: For the moment nothing is returned
    """

    DEFAULT_CONFIG = get_default_config()

    blueprint_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['blueprints']
    aux_dict = {"bp_folder_name":list(args.keys())[0]+"_"+str(uuid.uuid4()),"bp_name":list(args.keys())[0]}
    blueprint_Json = os.path.join(blueprint_path, 'cookiecutter.json')
    with open(blueprint_Json, 'w') as f:
        json.dump(aux_dict, f)

    try:
        template = cookiecutter(blueprint_path, no_input=True, extra_context=aux_dict, output_dir=template_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        aux_dict['bp_folder_name'] = aux_dict['bp_folder_name'] + str(uuid.uuid4())
        template = cookiecutter(blueprint_path, no_input=True, extra_context=aux_dict, output_dir=template_path)

    bp_endpoints = list(args.values())
    for endpoints in bp_endpoints:
        for endpoint in endpoints:
            endpoint['bp_name'] = aux_dict['bp_name']
            endpoint_creator(endpoint, template+'/'+aux_dict['bp_name']+'.py', endpoint_type, endpoint_use)

    shutil.move(template+'/'+aux_dict['bp_name']+'.py', template_path)
    remove_temp_files(template)
        
def add_404(path:str = None) -> None:
    """
        @param: path: Path to the base template
    """

    with open (path, 'a+') as f:
        f.write('''
@app.errorhandler(404)
def page_not_found(e):  
    return render_template('404.html')

''')
    



def create_controllers(args: dict = None, template_path: str = None, endpoint_type:str = None, endpoint_use:str = None, strict_mode:str = None) -> None:

    """
        @param: args: Dictionary with the arguments to create the controller template
        @param: template_path: Path to the base folder
        @param: endpoint_type: Type of endpoint to create
        @param: endpoint_use: Use of the endpoint to create

    """

    DEFAULT_CONFIG = get_default_config()

    controller_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['controllers']

    aux_dict = {"controller_folder_name":list(args.keys())[0]+ "_" + str(uuid.uuid4()), "controller_name":list(args.keys())[0], 'strict':strict_mode}
    controller_Json = os.path.join(controller_path, 'cookiecutter.json')
    with open(controller_Json, 'w') as f:
        json.dump(aux_dict, f)

    try:
        template = cookiecutter(controller_path, no_input=True, extra_context=aux_dict, output_dir=template_path+'/controllers')
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        aux_dict['controller_folder_name'] = aux_dict['controller_folder_name'] + str(uuid.uuid4())
        template = cookiecutter(controller_path, no_input=True, extra_context=aux_dict, output_dir=template_path +'/controllers')

    controller_endpoints = list(args.values())   
    for endpoints in controller_endpoints:
        for endpoint in endpoints:
            endpoint['endpoint_name'] = aux_dict['controller_name']
            endpoint['handler_type'] = aux_dict.get('controller_name')
            endpoint_creator(endpoint, template+'/'+aux_dict['controller_name']+'.js', endpoint_type, endpoint_use)

    with open(template+'/'+aux_dict.get('controller_name')+'.js', 'a+') as f:
        f.write('\n')
        f.write('''module.exports = {}'''.format(aux_dict.get('controller_name')))

    shutil.move(template+'/'+aux_dict['controller_name']+'.js', template_path +'/controllers')
    remove_temp_files(template)



def add_app_listen(args: dict = None, template_path: str = None, aux_path:str = None, output_path:str = None) -> None:
    
    """
        @param: args: Dictionary with the arguments to create the controller template
        @param: template_path: Path to the base folder
    """
   
    args["listen_folder_name"] = args.get("app_name") + "_" + str(uuid.uuid4())
    args["listen_name"] = args.get("app_name")
    listen_Json = os.path.join(aux_path, 'cookiecutter.json')
    with open(listen_Json, 'w') as f:
        json.dump(args, f)

    try:
        template = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['listen_folder_name'] = args['listen_folder_name'] + str(uuid.uuid4())
        template = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)

    with open(template_path, 'a+') as f:
        with open(template+"/"+args.get("listen_name")+".js", 'r') as f2:
            f.write(f2.read())

    remove_temp_files(template) 



def create_sub_app(args: dict = None, template_path: str = None, aux_path:str= None) -> None:
    """
        @param: args: Dictionary with the arguments to create the sub app template
        @param: template_path: Path to the base folder
        @param: aux_path: Path to the aux folder of the sub app template
    """

    args["subapp_folder_name"] = args.get("subapp_name") # Here isn't needed the uuid bc the unique name will be controlled in the front
    subapp_json = os.path.join(aux_path, 'cookiecutter.json')
    with open(subapp_json, 'w') as f:
        json.dump(args, f)

    try:
        template = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=template_path+'/subapps')
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['subapp_folder_name'] = args['subapp_folder_name'] + str(uuid.uuid4())
        template = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=template_path+'/subapps')


if __name__ == '__main__':
    # pprint(express_service_test)
    temp_creator(django_test_service, "django", "services")