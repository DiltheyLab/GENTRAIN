import os

from werkzeug.utils import secure_filename

from src.domains.sequence_analysis.exceptions import SequenceAnalysisFailedException


def get_src_path():
    """Retrieve the directory path for the project root."""

    return os.path.dirname(os.path.realpath(__file__))

def get_project_path():
    """Retrieve the directory path for the project root."""
    return os.path.dirname(get_src_path())

def get_pathogen_scheme_path(pathogen_id):
    """Retrieve the directory path for a pathogen scheme."""
    return f"{get_project_path()}/data/pathogen_schemes/{secure_filename(str(pathogen_id))}"

def get_script_path(pathogen_type):
    """Retrieve the directory path for a specific sequence analysis script."""
    if pathogen_type == "bacterial":
        return f"{get_project_path()}/scripts/bacterial_sequence_analysis.pl"
    if pathogen_type == "viral":
        return f"{get_project_path()}/scripts/viral_sequence_analysis.sh"
    raise SequenceAnalysisFailedException


