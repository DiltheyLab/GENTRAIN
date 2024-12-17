from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class BacterialSchemeProcessor(SchemeProcessorStrategy):
    """Concrete analysis strategy for bacterial sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.type = "bacterial"

    def extract_scheme(self):
        return
