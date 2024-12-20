from flask import send_from_directory
from backend.app import app


@app.route('/docs/')
@app.route('/docs/<path:path>')
def mkdocs(path=""):
    """Serve the index.html file."""
    return send_from_directory(f"{app.static_folder}/docs",
                               f"{path}index.html" if "assets" not in path and "search" not in path else
                               f"{path}")
