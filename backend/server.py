import os
import sys
from flask import Flask
from flask_cors import CORS
from .routes import api

sys.path.insert(0, os.path.realpath(os.path.dirname(__file__)))
print(sys.path)

app = Flask(__name__)

if os.environ.get("FLASK_ENV") == "local":
    CORS(app, origins=["http://localhost:3000", "http://localhost:4173"])

app.register_blueprint(api, url_prefix="/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
