import pytest
from werkzeug.utils import secure_filename

from src.config import get_src_path, get_project_path, get_pathogen_scheme_path, get_script_path
from src.domains.sequence_analysis.exceptions import SequenceAnalysisFailedException


def test_get_project_path_returns_correct_path():
    project_path = get_project_path()
    assert project_path == '/api'

def test_get_src_path_returns_correct_path():
    src_path = get_src_path()
    assert src_path == '/api/src'

@pytest.mark.parametrize("pathogen_id", [1, "test", "test_pathogen", ":unsecure_path:"])
def test_get_pathogen_scheme_path_returns_correct_and_secure_path(pathogen_id):
    pathogen_scheme_path = get_pathogen_scheme_path(pathogen_id)
    assert pathogen_scheme_path == f"/api/data/pathogen_schemes/{secure_filename(str(pathogen_id))}"

def test_get_script_path_returns_viral_sequence_analysis_script_for_type_viral():
    script_path = get_script_path("viral")
    assert script_path == f"/api/scripts/viral_sequence_analysis.sh"

def test_get_script_path_returns_bacterial_sequence_analysis_script_for_type_bacterial():
    script_path = get_script_path("bacterial")
    assert script_path == f"/api/scripts/bacterial_sequence_analysis.pl"

def test_get_script_path_raises_exception_for_invalid_type_input():
    with pytest.raises(SequenceAnalysisFailedException):
        get_script_path(":invalid_type_input:")
