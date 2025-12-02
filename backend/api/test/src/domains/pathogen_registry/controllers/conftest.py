import io

import pytest


### pathogen_controller.download_schema_action ###

@pytest.fixture
def mock_success_setup_for_download_schema_action(mocker, make_pathogen):
    pathogen = make_pathogen()
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_isdir = mocker.patch("os.path.isdir", return_value=True)
    mock_create_zip_buffer_from_scheme_directory = mocker.patch(
        "src.domains.pathogen_registry.controllers.pathogen_controller.create_zip_buffer_from_scheme_directory",
        return_value=io.BytesIO())
    return {
        "pathogen": pathogen,
        "pathogen_prisma": mock_pathogen_prisma,
        "isdir": mock_isdir,
        "create_zip_buffer_from_scheme_directory": mock_create_zip_buffer_from_scheme_directory,
    }



### pathogen_controller.download_example_data_action ###

@pytest.fixture
def mock_success_setup_for_download_example_data_action(mocker, make_pathogen, request):
    pathogen_type = getattr(request, "param", None)
    pathogen = make_pathogen(pathogen_id=0, name="sample", pathogen_type=pathogen_type or "viral")
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_exists = mocker.patch("os.path.exists", return_value=True)
    mock_get_project_path = mocker.patch(
        "src.domains.pathogen_registry.controllers.pathogen_controller.get_project_path", return_value=f"/api/test")

    return {
        "pathogen": pathogen,
        "pathogen_prisma": mock_pathogen_prisma,
        "exists": mock_exists,
        "get_project_path": mock_get_project_path
    }

