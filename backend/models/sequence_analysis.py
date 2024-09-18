from pydantic import BaseModel


# sequence variants action models
class SequenceAnalysisRequestBodyModel(BaseModel):
    sequence: str


class ViralSequenceAnalysisResponseModel(BaseModel):
    nextclade_version: str
    lineage: str
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentRange: object


class BacterialSequenceAnalysisResponseModel(BaseModel):
    chewBACCA_version: str
    analysis_schema: str
    allele_hashes: dict
    allele_ids: dict
