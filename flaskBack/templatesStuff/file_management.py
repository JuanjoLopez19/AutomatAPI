import shutil, json
import os
import boto3
import dotenv


def compress_api(workingDir: str, projectName: str) -> str:
    """
        @param: workingDir: Directory where the project is located
        @param projectName: Name of the project to compress
        @return: The path to the zip file

        These function zip the project and delete the folder to save space on the server
    """

    DEFAULT_CONFIG = get_default_config()

    output_path = add_base_path(
        DEFAULT_CONFIG['cookiecutter']['aux_stuff']['output_path'])
    try:
        path = shutil.make_archive("{}{}".format(output_path, projectName),
                                   'zip', workingDir)
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
    with open(
            '{}/params.json'.format(os.path.dirname(
                os.path.abspath(__file__))), 'r') as f:
        config = json.load(f)
    return config


def add_base_path(path: str, *paths) -> str:
    """
        @param: path: The path to the file
        @return: The path with the base path
    """

    if len(paths) > 0:
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), path,
                            *paths)
    else:
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
    
def upload_to_S3(path: str, key: str) -> str:
    """
        @param: path: The path to the file
        @param: key: The key to the file
        @return: The key to download the file from the S3 bucket
    """
    # Code to upload to S3
    dotenv.load_dotenv()
    bucket = os.getenv('BUCKET')
    try:
        s3 = boto3.client("s3")
        response = s3.upload_file(path, bucket, f'templates/{key}.zip')
        if response is None:
            return f'{key}.zip'
        else:
            return None
    except Exception as e:
        return None
   
