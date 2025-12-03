import pytest
from src.app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client
        
@app.route("/force-422")
def force_422():
    from flask import abort
    abort(422)

@app.route("/force-500")
def force_500():
    raise Exception("Internal Server Crash")

def test_not_found_handler(client):
    # Simulate 404 error
    response = client.get("/nonexistent")
    assert response.status_code == 404
    assert response.is_json
    data = response.get_json()
    assert data["error"] == "Not Found"
    assert data["message"] == "The requested resource could not be found."

def test_unprocessable_entity_handler(client):
    # The errorhandler only triggers for actual 422 errors,
    # so we forcibly raise it via a custom route.
    response = client.get("/force-422")
    assert response.status_code == 422
    assert response.is_json
    data = response.get_json()
    assert data["error"] == "Unprocessable Entity"
    assert data["message"] == "The requested resource could not be processed."

def test_internal_server_error_handler(client):
    # The errorhandler only triggers for actual 500 errors,
    # so we forcibly raise it via a custom route.

    response = client.get("/force-500")
    assert response.status_code == 500
    assert response.is_json
    data = response.get_json()
    assert data["error"] == "Internal Server Error"