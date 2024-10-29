from os import path
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import FileUploadField
from backend.server import get_project_root
from zipfile import ZipFile
import time
import shutil


class PathogenView(ModelView):
    form_choices = {
        "type": [
            ("bacterial", "Bacterial"),
            ("viral", "Viral"),
        ]
    }
    form_overrides = {"scheme_path": FileUploadField}
    form_args = {
        "scheme_path": {
            "label": "File",
            "base_path": path.join(get_project_root(), "datasets/uploads"),
            "allow_overwrite": True,
        }
    }

    def after_model_change(self, form, model, is_created):
        with ZipFile(
            path.join(get_project_root(), f"datasets/uploads/{model.scheme_path}"), "r"
        ) as file:
            directory_name = f"{model.scheme_name}_{round(time.time() * 1000)}"
            file.extractall(
                path=path.join(
                    get_project_root(),
                    f"datasets/chewBBACA_schemes/{directory_name}",
                )
            )
            shutil.move(
                path.join(
                    get_project_root(),
                    f"datasets/chewBBACA_schemes/{directory_name}",
                ),
                path.join(
                    get_project_root(),
                    f"datasets/chewBBACA_schemes/{model.scheme_name}",
                ),
            )
