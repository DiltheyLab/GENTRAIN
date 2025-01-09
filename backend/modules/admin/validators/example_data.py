from backend.modules.admin.strategies.example_data_validator.bacterial_example_data_validator import \
    BacterialExampleDataValidator
from backend.modules.admin.strategies.example_data_validator.viral_example_data_validator import \
    ViralExampleDataValidator


def cases_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_cases_example(field.data)

def contacts_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_contacts_example(field.data)

def sequences_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_sequences_example(field.data)
