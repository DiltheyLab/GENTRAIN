import re
from flask import request
from prisma.models import pathogen as Pathogen
from src.domains.sequence_analysis.redis_actions import (
    get_merged_fasta_content_if_complete,
    persist_fasta_chunk,
)
from src.domains.sequence_analysis.strategies import (
    ViralSequenceAnalysis,
    BacterialSequenceAnalysis,
)
from src.server import sio, queue_viral, queue_bacterial

@sio.event
def init_sequence_analysis(fasta_chunk, chunk_information, pathogen_id, fasta_hash=None):
    """
    Collect fasta chunks for sequence analysis and init the analysis when all chunks were successfully transferred.

    Parameters:
        fasta_chunk -- Chunk of a fasta file in case viral analyses and a chunk of a sequence in case of bacterial analyses
        chunk_information -- Dictionary containing information about the chunking id, the index of the transferred chunk
            and the total amount of chunks relating to the current analysis
        pathogen_id -- Postgres db id of the selected pathogen
        fasta_hash -- Hashed fasta content
    """
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    socket_id = request.sid
    fasta_chunk = fasta_chunk.replace("\r", "")
    # ensure pseudonymization of bacterial fasta assemblies by removing potentially included ids in headers
    if pathogen.type == "bacterial":
        fasta_chunk = re.sub(r"\>(.*?)\n", ">\n", fasta_chunk)
    persist_fasta_chunk(fasta_chunk, socket_id, chunk_information)

    fasta_content = get_merged_fasta_content_if_complete(socket_id, chunk_information)

    # prevent initialization of sequence analysis job in case the fasta content is not yet complete
    if not fasta_content:
        return

    enqueue_sequence_analysis_job(socket_id, pathogen, fasta_content, fasta_hash)


def enqueue_sequence_analysis_job(socket_id, pathogen, fasta_content, fasta_hash=None):
    """
    Instantiate a sequence analysis strategy depending on the type of the selected pathogen and enqueue a job.

    Parameters:
        socket_id -- Id of the websocket connection
        pathogen -- Selected pathogen
        identifier -- Batch identifier for the transmitted batch of a fasta file in case of viral analyses
            and a pseudonymized sequence identifier in case of bacterial analyses
        fasta_content -- Complete fasta content containing multiple sequences for viral analyses
            and a single sequence assembly for bacterial analyses
        fasta_hash -- Hashed fasta content
    """
    strategy = (
        ViralSequenceAnalysis(
            pathogen=pathogen,
            fasta_content=fasta_content,
            socket_id=socket_id,
        )
        if pathogen.type == "viral"
        else BacterialSequenceAnalysis(
            pathogen=pathogen,
            fasta_content=fasta_content,
            socket_id=socket_id,
            fasta_hash=fasta_hash,
        )
    )
    strategy.enqueue_analysis(
        queue_viral if pathogen.type == "viral" else queue_bacterial
    )
