from backend.modules.admin.strategies.example_data_processor.example_data_processor_strategy import ExampleDataProcessor


class BacterialExampleDataProcessor(ExampleDataProcessor):
    """Concrete scheme processor strategy for bacterial example data processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
