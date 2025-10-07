from pydantic import BaseModel


class ViralSequenceAnalysisResponseModel(BaseModel):
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


class BacterialSequenceAnalysisResponseModel(BaseModel):
    chewBACCA_version: str
    analysis_schema: str
    allele_hashes: dict
    allele_ids: dict
    undeterminable_gen_count: int
    contig_count: int
    first_contig_length: int
