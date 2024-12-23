from types import NoneType

from backend.modules.admin.strategies.bacterial_scheme_validator import BacterialSchemeValidator
from backend.modules.admin.strategies.viral_scheme_validator import ViralSchemeValidator


def scheme_validator(form, field):
    if type(field.data) == str or type(field.data) == NoneType:
        return

    validator = ViralSchemeValidator(field.data.stream,
                                     form) if form.type.data == "viral" else BacterialSchemeValidator(field.data.stream,
                                                                                                      form)
    validator.validate()
    field.data = validator.clean_zip()
