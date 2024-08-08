import os


def get_project_path():
    """Retrieve the directory path for the project root."""
    return os.path.dirname(os.path.realpath(__file__))
