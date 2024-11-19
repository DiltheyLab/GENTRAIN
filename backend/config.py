import os


def get_project_path():
    """Retrieve the directory path for the project root."""
    return os.path.dirname(os.path.realpath(__file__))


# Create dummy secrey key so we can use sessions
SECRET_KEY = os.environ.get("SECRET_KEY")

# Create in-memory database
SQLALCHEMY_DATABASE_URI = f"{os.environ.get('DATABASE_DRIVER')}://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@{os.environ.get('DATABASE_HOST')}:{os.environ.get('DATABASE_PORT')}/{os.environ.get('DATABASE_NAME')}"
SQLALCHEMY_ECHO = True

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

BASIC_AUTH_USERNAME = os.environ.get('ADMIN_HTBASIC_USERNAME')
BASIC_AUTH_PASSWORD = os.environ.get('ADMIN_HTBASIC_PASSWORD')
