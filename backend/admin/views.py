from os import path
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import FileUploadField
from backend.server import get_project_root


class PathogenView(ModelView):
    form_choices = {
        "type": [
            ("bacterial", "Bacterial"),
            ("viral", "Viral"),
        ]
    }
    form_overrides = {"scheme_name": FileUploadField}
    form_args = {
        "scheme_name": {
            "label": "File",
            "base_path": path.join(get_project_root(), "datasets/uploads"),
            "allow_overwrite": False,
        }
    }
