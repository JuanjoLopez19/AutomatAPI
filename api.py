
from cookiecutter.main import cookiecutter
import shutil
import os

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