import json
from cookiecutter.main import cookiecutter
from cookiecutter import exceptions
import shutil
import os
import uuid
import secrets


DEFAULT_CONFIG = {
    'cookiecutter':{
        'tecnology_args':{
            'flask':{
                'services':{
                    'app_name': '',
                    'port': '',
                    'connect_DB': '',
                    'config_file': '',
                    'type_config_file': '',
                    'secret':'',
                    'host': '',
                    'endpoints':[],
                    'template_path': './Templates/flask/services',
                },
                'app_web':{},  
            },
            'express':{
                'services':{},
                'app_web':{},
            },
            'django':{
                'services':{},
                'app_web':{},
            },
        },
        'endpoints_args':{
            'flask':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "get": "yes",
                "put": "no",
                "post": "no",
                "delete": "no",
                'template_path': './Templates/endpoints/flask',
            },
            'express':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "method":["get","post","put","delete"],
                'template_path': './Templates/endpoints/express',
            },
            'django':{
                'template_path': './Templates/endpoints/django',
            },
            'output_path': './temp_templates/'
        },
        'aux_stuff':{
            'flask_app_run_path': './Templates/flask/aux_stuff',
        }
    }
}


def temp_creator(template_args: dict = None) -> str:
    """
        @param: template_args: Dictionary with the arguments to create the template 

        @return: The path to the zip file that contains the filled template

        This function is the one that calls the cookiecutter function to create the template 
        and returns the path to the zip file, to the main rutine
    """

    template_args['tecnology']='flask'
    args = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args['tecnology']]['services']
    args['app_name'] = template_args['app_name'] + '_' + str(uuid.uuid4())
    args['port'] = template_args['port']
    args['connect_DB'] = template_args['connect_DB']
    args['config_file'] = template_args['config_file']
    args['type_config_file'] = template_args['type_config_file']
    args['secret'] = secrets.token_hex(16)
    args['host'] = template_args['host']
    

    endpoints = template_args['endpoints']
    args.pop('endpoints')

    cookiecutter_template_path = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args['tecnology']]['services']['template_path']
    output_path = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']

    if not os.path.exists(DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']):
        os.makedirs(DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path'])

    cookiecutteJsonFile = os.path.join(cookiecutter_template_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(args, f)
    try:
        template_path = cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['app_name'] = args['app_name'] + str(uuid.uuid4())
        cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
    
    for endpoint in endpoints:
        endpoint_creator(endpoint, template_path+'/'+args['app_name']+'.py', template_args['tecnology'])

    add_app_run(args,template_path+'/'+args['app_name']+'.py', DEFAULT_CONFIG['cookiecutter']['aux_stuff']['flask_app_run_path'])

    path = compress_api(template_path, args['app_name'], args['app_name'])
    return path

    
def endpoint_creator(template_args: dict = None, template_path:str = None, endpoint_type:str = None) -> str:
    """
        @param: template_args: Dictionary with the arguments to create the template
        @param: template_path: Path to the template to use
        @param: endpoint_type: Type of endpoint to create

        @return: For the moment nothing is returned
    """
    config =  DEFAULT_CONFIG['cookiecutter']['endpoints_args'][endpoint_type]
    temp_path = config['template_path']

    config['file_name'] = template_args['endpoint_name'] + '_' + str(uuid.uuid4())
    config['endpoint_name'] = template_args['endpoint_name']
    config['endpoint_url'] = template_args['endpoint_url']
    config['get'] = template_args['get']
    config['put'] = template_args['put']
    config['post'] = template_args['post']
    config['delete'] = template_args['delete']

    cookiecutteJsonFile = os.path.join(temp_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(config, f)

    output_path = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']
    
    try:
        aux_path = cookiecutter(temp_path, no_input=True, extra_context=config, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        config['file_name'] = config['file_name'] + str(uuid.uuid4())
        aux_path = cookiecutter(temp_path, no_input=True, extra_context=config, output_dir=output_path)

    try:
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
    output_path = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']

    cookiecutteJsonFile = os.path.join(aux_path, 'cookiecutter.json')
    with open(cookiecutteJsonFile, 'w') as f:
        json.dump(args, f)

    try:
        run_path = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)
    except exceptions.OutputDirExistsException as e:
        # In fact this exception is never raised because of the uuid but I will leave it here just in case
        args['app_name'] = args['app_name'] + str(uuid.uuid4())
        run_path = cookiecutter(aux_path, no_input=True, extra_context=args, output_dir=output_path)

    try:
        with open(template_path, 'a+') as f:
            with open(run_path+"/"+args['app_name']+'.py', 'r') as f2:
                f.write(f2.read())

        remove_temp_files(run_path)
    except FileNotFoundError as e:
        print(e)

          
def compress_api(workingDir: str, projectName: str, fileName: str) -> None:
    """
        @param: workingDir: Directory where the project is located
        @param projectName: Name of the project to compress
        @param fileName: Name of the zip file
        @return: The path to the zip file

        These function zip the project and delete the folder to save space on the server
    """
    print(workingDir)
    print(projectName.split('_')[0])
    print(fileName) 
    try:
        path = shutil.make_archive(workingDir+projectName.split('_')[0], 'zip', workingDir )
        shutil.rmtree(workingDir) 
    except (OSError, FileNotFoundError) as e:
        path = None
        print(e)
    return path



def remove_temp_files(workingDir: str) -> None:
    """
        @param: workingDir: Directory where the temp files are located
        @return: None
    """

    shutil.rmtree(workingDir)

if __name__ == '__main__':
    test ={
        'app_name': 'prueba',
        'port': '5000',
        'connect_DB': 'yes',
        'config_file': 'yes',
        'type_config_file': 'prod',
        'secret':'',
        'host': '0.0.0.0',
        'endpoints':[
            {
                "endpoint_name": "prueba1",
                "endpoint_url": "/prueba1",
                "get": "yes",
                "put": "yes",
                "post": "no",
                "delete": "no",
            },
            {
                "endpoint_name": "prueba2",
                "endpoint_url": "/prueba2",
                "get": "yes",
                "put": "yes",
                "post": "no",
                "delete": "yes",
            },
            {
                "endpoint_name": "prueba3",
                "endpoint_url": "/prueba3",
                "get": "no",
                "put": "yes",
                "post": "no",
                "delete": "yes",
            },
        ],
    }
    temp_creator(test)