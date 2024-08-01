from pydantic import BaseModel


# request model
class SequenceVariantsRequestBodyModel(BaseModel):
    sequence: str


# response model
class ViralSequenceVariantsResponseModel(BaseModel):
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentStart: int
    alignmentEnd: int


class BacterialSequenceVariantsResponseModel(BaseModel):
    schema: str
    alleles: list[object]
