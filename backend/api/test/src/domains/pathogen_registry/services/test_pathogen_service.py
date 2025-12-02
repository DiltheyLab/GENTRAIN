import tempfile
from zipfile import ZipFile

import pytest

from src.domains.pathogen_registry.exceptions import NestedZipException, InvalidPathogenTypeException, \
    InvalidExampleDataTypeException
from src.domains.pathogen_registry.services.pathogen_service import create_zip_buffer_from_scheme_directory, \
    get_example_data_filename


### create_zip_buffer_from_scheme_directory ###

def test_create_zip_buffer_from_scheme_directory_throws_exception_if_directory_does_not_exist():
    with pytest.raises(NotADirectoryError):
        create_zip_buffer_from_scheme_directory("/path/does/not/exist")


def test_create_zip_buffer_from_scheme_directory_throws_exception_if_directory_is_empty():
    with tempfile.TemporaryDirectory() as tmpdir:
        with pytest.raises(FileNotFoundError):
            create_zip_buffer_from_scheme_directory(tmpdir)


def test_create_zip_buffer_from_scheme_directory_throws_exception_if_directory_contains_zip():
    with pytest.raises(NestedZipException):
        create_zip_buffer_from_scheme_directory("/api/test/data/nested_zip_directory")


def test_create_zip_buffer_from_scheme_directory_returns_zip_with_all_files_including_nested_structures():
    zip_buffer = create_zip_buffer_from_scheme_directory("/api/test/data/sample_zip_directory")
    zip_file = ZipFile(zip_buffer)
    assert {'root_file_1.txt', 'root_file_2.txt', 'nested_files/nested_file_2.txt',
            'nested_files/nested_file_1.txt'} == set(zip_file.namelist())


### get_example_data_filename ###

def test_get_example_data_filename_throws_exception_when_requesting_sequence_example_data_with_invalid_pathogen_type(
        make_pathogen):
    with pytest.raises(InvalidPathogenTypeException):
        pathogen = make_pathogen(pathogen_type=":invalid_example_data_type:")
        get_example_data_filename(pathogen, "sequence")


@pytest.mark.parametrize("pathogen_type", ["viral", "bacterial"])
def test_get_example_data_filename_throws_exception_when_requesting_invalid_example_data_type(
        make_pathogen, pathogen_type):
    with pytest.raises(InvalidExampleDataTypeException):
        pathogen = make_pathogen(pathogen_type=pathogen_type)
        get_example_data_filename(pathogen, ":invalid_example_data_type:")


@pytest.mark.parametrize("pathogen_name, example_data_type, pathogen_type",
                         [("Pathogen 1", "case", "viral"), ("Pathogen 1", "contact", "viral"),
                          ("Pathogen 1", "sequence", "viral"), ("Pathogen 1", "case", "bacterial"),
                          ("Pathogen 1", "contact", "bacterial"),
                          ("Pathogen 1", "sequence", "bacterial")])
def test_get_example_data_filename_returns_filename_containing_slug_of_pathogen_name(
        make_pathogen, pathogen_name, example_data_type, pathogen_type):
    pathogen = make_pathogen(name=pathogen_name, pathogen_type=pathogen_type)
    filename = get_example_data_filename(pathogen, example_data_type)
    pathogen_slug = pathogen.name.lower().replace(' ', '-').replace(r'[^\w\-]', '-')
    assert pathogen_slug in filename


@pytest.mark.parametrize("example_data_type, pathogen_type, expected_extension",
                         [("case", "viral", "csv"), ("contact", "viral", "csv"),
                          ("sequence", "viral", "fasta"), ("case", "bacterial", "csv"), ("contact", "bacterial", "csv"),
                          ("sequence", "bacterial", "zip")])
def test_get_example_data_filename_returns_correct_extension_for_example_data_types_and_pathogen_types(make_pathogen,
                                                                                                       example_data_type,
                                                                                                       pathogen_type,
                                                                                                       expected_extension):
    pathogen = make_pathogen(pathogen_type=pathogen_type)
    filename = get_example_data_filename(pathogen, example_data_type)
    assert expected_extension in filename
