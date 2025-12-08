import pytest
import sys


def test_main_setup_for_production(monkeypatch, mocker):
    if "src.server" in sys.modules:
        del sys.modules["src.server"]
    # Set env vars before import
    monkeypatch.setenv("REDIS_HOST", "testhost")
    monkeypatch.setenv("REDIS_PORT", "1234")
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("REDIS_USERNAME", "user")
    monkeypatch.setenv("REDIS_PASSWORD", "secret")
    monkeypatch.setenv("REACT_DEV_PORT", "3000")
    monkeypatch.setenv("REACT_BUILD_PORT", "4000")

    mock_app = mocker.patch("src.app.app")
    mock_redis = mocker.patch("redis.Redis")
    mock_queue = mocker.patch("rq.Queue")
    mock_socket_io = mocker.patch("flask_socketio.SocketIO")

    import src.server

    mock_redis.assert_called_once_with(
        host="testhost",
        port=1234,
        username="user",
        password="secret",
        decode_responses=True,
        health_check_interval=30,
    )
    mock_socket_io.assert_called_once_with(
        mock_app,
        async_mode="threading",
        message_queue=f"redis://user:secret@testhost:1234",
        cors_allowed_origins=[],
    )
    mock_queue.assert_any_call(name="viral", connection=mock_redis.return_value)
    mock_queue.assert_any_call(name="bacterial", connection=mock_redis.return_value)
    mock_queue.assert_any_call(name="viral", connection=mock_redis.return_value)


def test_main_setup_for_development(monkeypatch, mocker):
    if "src.server" in sys.modules:
        del sys.modules["src.server"]
    # Set env vars before import
    monkeypatch.setenv("REDIS_HOST", "testhost")
    monkeypatch.setenv("REDIS_PORT", "1234")
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.setenv("REDIS_USERNAME", "user")
    monkeypatch.setenv("REDIS_PASSWORD", "secret")
    monkeypatch.setenv("REACT_DEV_PORT", "3000")
    monkeypatch.setenv("REACT_BUILD_PORT", "4000")

    mock_app = mocker.patch("src.app.app")
    mock_redis = mocker.patch("redis.Redis")
    mock_queue = mocker.patch("rq.Queue")
    mock_socket_io = mocker.patch("flask_socketio.SocketIO")

    import src.server

    mock_redis.assert_called_once_with(
        host="testhost",
        port=1234,
        username="user",
        password="secret",
        decode_responses=True,
        health_check_interval=30,
    )
    mock_socket_io.assert_called_once_with(
        mock_app,
        async_mode="threading",
        message_queue=f"redis://user:secret@testhost:1234",
        cors_allowed_origins=[
            "http://localhost:3000",
            "http://localhost:4000",
        ],
    )
    mock_queue.assert_any_call(name="viral", connection=mock_redis.return_value)
    mock_queue.assert_any_call(name="bacterial", connection=mock_redis.return_value)
    mock_queue.assert_any_call(name="viral", connection=mock_redis.return_value)
