from backend.modules.admin.strategies.example_data_validator.bacterial_example_data_validator import \
    BacterialExampleDataValidator
from backend.modules.admin.strategies.example_data_validator.viral_example_data_validator import \
    ViralExampleDataValidator
from backend.modules.admin.validators.fields.cases_example_data import cases_example_data_fields
from backend.modules.admin.validators.fields.contacts_example_data import contacts_example_data_fields


def cases_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_example_data_csv(cases_example_data_fields, field.data)


def contacts_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_example_data_csv(contacts_example_data_fields, field.data)


def sequences_example_validator(form, field):
    if not field.data:
        return
    validator = ViralExampleDataValidator() if form.type.data == "viral" else BacterialExampleDataValidator()
    validator.validate_sequences_example(field.data)
