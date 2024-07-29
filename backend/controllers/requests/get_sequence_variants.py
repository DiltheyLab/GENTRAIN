from pydantic import BaseModel
import re


# request model
class SequenceVariantsRequestBodyModel(BaseModel):
    sequence: str


# response model
class SequenceVariantsResponseModel(BaseModel):
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentStart: int
    alignmentEnd: int
