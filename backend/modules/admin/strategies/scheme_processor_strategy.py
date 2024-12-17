from abc import ABC, abstractmethod

from backend.config import get_project_path


class SchemeProcessorStrategy(ABC):
    """Scheme Processor Strategy Class."""
    schemes_root: str = f"{get_project_path()}/modules/sequence_analysis/schemes"
    extract_path = None

    def __init__(self, pathogen, prior_scheme_name):
        self.pathogen = pathogen
        self.prior_scheme_name: str = prior_scheme_name

    @abstractmethod
    def extract_scheme(self):
        """Extract scheme from zip to extraction directory."""
