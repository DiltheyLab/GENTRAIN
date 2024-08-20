from pydantic import BaseModel


# sequence variants action models
class SequenceVariantsRequestBodyModel(BaseModel):
    sequence: str


class ViralSequenceVariantsResponseModel(BaseModel):
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentRange: object


class BacterialSequenceVariantsResponseModel(BaseModel):
    alleles: list[object]
