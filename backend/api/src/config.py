import os

def get_src_path():
    """Retrieve the directory path for the project root."""

    return os.path.dirname(os.path.realpath(__file__))

def get_project_path():
    """Retrieve the directory path for the project root."""

    return os.path.dirname(get_src_path())


def get_scripts_path():
    """Retrieve the directory path for the sequence analysis scripts."""
    return f"{get_src_path()}/domains/sequence_analysis/scripts"