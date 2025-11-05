from pydantic import BaseModel

class BacterialSequenceAnalysis(BaseModel):
    chewBACCA_version: str
    analysis_schema: str
    allele_hashes: dict
    allele_ids: dict
    undeterminable_gen_count: int
    contig_count: int
    first_contig_length: int
