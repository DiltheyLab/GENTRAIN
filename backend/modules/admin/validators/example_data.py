from backend.modules.admin.strategies.example_data_validator.bacterial_example_data_validator import \
    BacterialExampleDataValidator
from backend.modules.admin.strategies.example_data_validator.viral_example_data_validator import \
    ViralExampleDataValidator


def validate_cases_example(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_cases_example(field.data)

def validate_contacts_example(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_contacts_example(field.data)

def validate_sequences_example(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_sequences_example(field.data)
