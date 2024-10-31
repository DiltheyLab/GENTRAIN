from os import path, listdir, remove, rename
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import FileUploadField
from backend.config import get_project_path
from zipfile import ZipFile
import time
import shutil
from backend.server import sio


class PathogenView(ModelView):
    prior_scheme_name = None
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
            "base_path": path.join(get_project_path(), "schemes"),
            "allow_overwrite": True,
            "allowed_extensions": ["zip"]
        }
    }

    def update_model(self, form, model):
        self.prior_scheme_name = model.scheme_name
        return super().update_model(form, model)

    def after_model_change(self, form, model, is_created):
        if self.scheme_added(model.scheme_path):
            with ZipFile(
                path.join(get_project_path(), f"schemes/{model.scheme_path}"), "r"
            ) as archive:
                directory_name = f"{model.scheme_name}_{round(time.time() * 1000)}"
                extract_path = path.join(
                    get_project_path(),
                    f"schemes/{directory_name}",
                )
                archive.extractall(path=extract_path)
                content = listdir(
                    path.join(
                        get_project_path(),
                        f"schemes/{directory_name}",
                    )
                )
                if len(content) == 1:
                    sub_path = path.join(
                            get_project_path(),
                            f"schemes/{directory_name}/{content[0]}",
                        )
                    elements = listdir(sub_path)
                    for element in elements:
                        shutil.move(path.join(sub_path, element), extract_path)
                    shutil.rmtree(sub_path)
                if self.scheme_exists(self.prior_scheme_name):
                    shutil.rmtree(path.join(get_project_path(),f"schemes/{self.prior_scheme_name}"))
                shutil.move(
                    path.join(
                        get_project_path(),
                        f"schemes/{directory_name}",
                    ),
                    path.join(
                        get_project_path(),
                        f"schemes/{model.scheme_name}",
                    ),
                )
            remove(path.join(get_project_path(),f"schemes/{model.scheme_path}"))
        if is_created is False and model.scheme_name and model.scheme_name != self.prior_scheme_name:
            rename(path.join(get_project_path(),f"schemes/{self.prior_scheme_name}"), path.join(get_project_path(),f"schemes/{model.scheme_name}"))

    def after_model_delete(self, model):
        if path.isdir(path.join(get_project_path(),f"schemes/{model.scheme_name}")):
            shutil.rmtree(path.join(get_project_path(),f"schemes/{model.scheme_name}"))

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(path.join(get_project_path(),f"schemes/{scheme_name}"))

    def scheme_added(self, scheme_path):
        return path.isfile(path.join(get_project_path(), f"schemes/{scheme_path}"))