
from cookiecutter.main import cookiecutter
import shutil
import os


DEFAULT_CONFIG = {
    'cookiecutter':{
        'tecnology_args':{
        },
        'endpoints_args':{
            'flask':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "get": "yes",
                "put": "no",
                "post": "no",
                "delete": "no",
                'template_path': './Templates/endponts/flask',
            },
            'express':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "method":["get","post","put","delete"],
                'template_path': './Templates/endponts/express',
            },
            'django':{

                'template_path': './Templates/endponts/django',
            },
            'output_path': './temp_templates'
        },
        
    }
}


def main():
    
    cookiecutter('django/')
    compress_api('prueba', os.getcwd()+'/')
    
        
def compress_api(projectName: str, workingDir: str) -> None:
    """
        @param projectName: Name of the project to compress
        @param: workingDir: Directory where the project is located
        @return: None

        These function zip the project and delete the folder to save space on the server
    """

    shutil.make_archive(projectName, 'zip', workingDir)
    shutil.rmtree(workingDir+projectName) 
    # time.sleep(10)
    # os.remove(projectName+'.zip')


if __name__ == '__main__':
    main()