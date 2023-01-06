
import json
from cookiecutter.main import cookiecutter
from cookiecutter import exceptions
import shutil
import os
import uuid


DEFAULT_CONFIG = {
    'cookiecutter':{
        'tecnology_args':{
            'flask':{
                'services':{},
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
        
    }
}

def temp_creator(template_args: dict = None) -> str:
    """
        @param: template_args: Dictionary with the arguments to create the template 

        @return: The path to the zip file that contains the filled template

        This function is the one that calls the cookiecutter function to create the template 
        and returns the path to the zip file, to the main rutine
    """
    args = DEFAULT_CONFIG['cookiecutter']['tecnology_args'][template_args['tecnology']]
    """
    endpointType = input("Introduce the endpoint type (flask, express, django): ")
    if endpointType == "flask":
        endpointName = input("Introduce the endpoint name: ")
        endpointUrl = input("Introduce the endpoint url: ")
        get = input("Do you want to add a get method (yes/no): ")
        put = input("Do you want to add a put method (yes/no): ")
        post = input("Do you want to add a post method (yes/no): ")
        delete = input("Do you want to add a delete method (yes/no): ")
        cookiecutter_template_path = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['flask']['template_path']
        output_path = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']
        args = DEFAULT_CONFIG['cookiecutter']['endpoints_args']['flask']
        args['file_name'] = endpointName + '_' + str(uuid.uuid4())
        args['endpoint_name'] = endpointName
        args['endpoint_url'] = endpointUrl
        args['get'] = get
        args['put'] = put
        args['post'] = post
        args['delete'] = delete

        if not os.path.exists(DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path']):
            os.makedirs(DEFAULT_CONFIG['cookiecutter']['endpoints_args']['output_path'])

        cookiecutteJsonFile = os.path.join(cookiecutter_template_path, 'cookiecutter.json')
        with open(cookiecutteJsonFile, 'w') as f:
            json.dump(args, f)
        try:
            cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
        except exceptions.OutputDirExistsException as e:
            # In fact this exception is never raised because of the uuid but I will leave it here just in case
            args['file_name'] = args['file_name'] + str(uuid.uuid4())
            cookiecutter(cookiecutter_template_path, no_input=True, extra_context=args, output_dir=output_path)
    """
    
    path = compress_api(os.getcwd()+'/'+output_path,  args['file_name'],args['endpoint_name'])
    return path
    
        
def compress_api(workingDir: str, projectName: str, fileName: str) -> None:
    """
        @param: workingDir: Directory where the project is located
        @param projectName: Name of the project to compress
        @param fileName: Name of the zip file
        @return: The path to the zip file

        These function zip the project and delete the folder to save space on the server
    """
    try:
        path = shutil.make_archive(workingDir+'/'+fileName, 'zip', workingDir+'/'+projectName )
        shutil.rmtree(workingDir+projectName) 
    except (OSError, FileNotFoundError):
        path = None
    return path



def remove_temp_files(workingDir: str) -> None:
    """
        @param: workingDir: Directory where the temp files are located
        @return: None
    """

    shutil.rmtree(workingDir)

if __name__ == '__main__':
    temp_creator()