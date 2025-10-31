import os
from datetime import timedelta

from flask_security import uia_username_mapper


def get_project_path():
    """Retrieve the directory path for the project root."""
    return os.path.dirname(os.path.realpath(__file__))

def get_scripts_path():
    """Retrieve the directory path for the sequence analysis scripts."""
    return f"{get_project_path()}/domains/sequence_analysis/scripts"

SECRET_KEY = os.environ.get("SECRET_KEY")

# Session-Cookie setting
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Strict'
PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)

# Create in-memory database
SQLALCHEMY_DATABASE_URI = f"{os.environ.get('DATABASE_DRIVER')}://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@{os.environ.get('DATABASE_HOST')}:{os.environ.get('DATABASE_PORT')}/{os.environ.get('DATABASE_NAME')}"
SQLALCHEMY_ECHO = False

# Flask-Security config
SECURITY_URL_PREFIX = "/admin"
SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
SECURITY_PASSWORD_SALT = "ATGUOHAELKiubahiughaerGOJAEGj"

# Flask-Security URLs, overridden because they don't put a / at the end
SECURITY_LOGIN_URL = "/login/"
SECURITY_LOGOUT_URL = "/logout/"
SECURITY_REGISTER_URL = "/register/"

SECURITY_POST_LOGIN_VIEW = "/admin/"
SECURITY_POST_LOGOUT_VIEW = "/admin/"
SECURITY_POST_REGISTER_VIEW = "/admin/"

# Flask-Security features
SECURITY_REGISTERABLE = False
SECURITY_CHANGEABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECURITY_USERNAME_ENABLE = True
SECURITY_USERNAME_REQUIRED = True
SECURITY_USER_IDENTITY_ATTRIBUTES = [{"username": {"mapper": uia_username_mapper, "case_insensitive": True}}]
SECURITY_MSG_INVALID_PASSWORD = ("Bad username or password", "error")
SECURITY_MSG_PASSWORD_NOT_PROVIDED = ("Bad username or password", "error")
SECURITY_MSG_USER_DOES_NOT_EXIST = ("Bad username or password", "error")
SECURITY_MSG_USERNAME_ILLEGAL_CHARACTERS = ("Bad username or password", "error")
SECURITY_MSG_USERNAME_DISALLOWED_CHARACTERS = ("Bad username or password", "error")
SECURITY_MSG_USERNAME_NOT_PROVIDED = ("Bad username or password", "error")
SECURITY_USERNAME_MIN_LENGTH = 0

BASIC_AUTH_USERNAME = os.environ.get("ADMIN_HTBASIC_USERNAME")
BASIC_AUTH_PASSWORD = os.environ.get("ADMIN_HTBASIC_PASSWORD")
