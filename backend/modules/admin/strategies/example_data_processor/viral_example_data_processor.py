from backend.modules.admin.strategies.example_data_processor.example_data_processor_strategy import ExampleDataProcessor


class ViralExampleDataProcessor(ExampleDataProcessor):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
