from pydantic import BaseModel

class ViralSequenceAnalysis(BaseModel):
    sequence_length: int
    nextclade_version: str
    analysis_schema: str
    lineage: str | None
    n_count: int
    substitutions: list[object]
    deletions: list[object]
    insertions: list[object]
    missing: list[object]
    nonACGTNs: list[object]
    alignmentRange: object