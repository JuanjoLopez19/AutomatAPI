import shutil, json

def compress_api(workingDir: str, projectName: str, fileName: str) -> str:

    """
        @param: workingDir: Directory where the project is located
        @param projectName: Name of the project to compress
        @return: The path to the zip file

        These function zip the project and delete the folder to save space on the server
    """

    DEFAULT_CONFIG = get_default_config()

    output_path = DEFAULT_CONFIG['cookiecutter']['aux_stuff']['output_path']

    try:
        path = shutil.make_archive("{}{}".format(output_path, projectName.split('_')[0]), 'zip', workingDir) 
        remove_temp_files(workingDir) 
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


def get_default_config() -> dict:

    """
        @return: The default configuration for the cookiecutter
    """

    with open('params.json', 'r') as f:
        config = json.load(f)
    return config