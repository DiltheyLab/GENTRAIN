from os import path, listdir
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import FileUploadField
from backend.config import get_project_path
from zipfile import ZipFile
import time
import shutil
from backend.server import sio


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
            "base_path": path.join(get_project_path(), "schemes/uploads"),
            "allow_overwrite": True,
        }
    }

    def after_model_change(self, form, model, is_created):
        if is_created is True:
            sio.emit(
                event="pathogen_created",
                data=model.serialize(),
            )
        else:
            sio.emit(
                event="pathogen_changed",
                data=model.serialize(),
            )
        with ZipFile(
            path.join(get_project_path(), f"schemes/uploads/{model.scheme_path}"), "r"
        ) as archive:
            directory_name = f"{model.scheme_path}_{round(time.time() * 1000)}"
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

    def after_model_delete(self, model):
        sio.emit(
            event="pathogen_deleted",
            data=model.id,
        )
