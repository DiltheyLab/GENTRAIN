from pydantic import BaseModel


# sequence variants action models
class SequenceAnalysisRequestBodyModel(BaseModel):
    sequence: str


class ViralSequenceAnalysisResponseModel(BaseModel):
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentRange: object


class BacterialSequenceAnalysisResponseModel(BaseModel):
    alleles: dict
