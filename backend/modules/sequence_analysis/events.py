import re
from flask import request
from flask_socketio import leave_room, join_room

from backend.modules.core.models import Pathogen
from backend.modules.sequence_analysis.redis import get_merged_fasta_content_if_complete, persist_fasta_chunk, \
    remember_session_id
from backend.modules.sequence_analysis.strategies import ViralSequenceAnalysis, BacterialSequenceAnalysis
from backend.server import sio, redis_connection, queue_viral, queue_bacterial


@sio.event
def join_sequence_analysis_room(gentrain_session_id, pathogen_type):
    """
    Join a sequence analysis room and remember the session id by mapping it to the connections socket id.

    gentrain_session_id: Session id created in frontend and used to retrieve cached results in case of a connection
        interruption
    pathogen_type: Type of the selected pathogen (viral | bacterial)
    """
    socket_id = request.sid
    remember_session_id(socket_id, gentrain_session_id)
    join_room(f"{pathogen_type}_{socket_id}")
    sio.emit(
        f"{pathogen_type}_room_created",
        f"{pathogen_type}_{socket_id}",
        to=f"{pathogen_type}_{socket_id}",
    )


@sio.event
def leave_sequence_analysis_room(pathogen_type):
    """
    Leave a sequence analysis room.
    Parameters:
        pathogen_type -- Type of the selected pathogen (viral | bacterial)
    """
    socket_id = request.sid
    leave_room(f"{pathogen_type}_{socket_id}")
    # delete socket-session-mapping from redis
    redis_connection.delete(f"client:gentrain_session:{socket_id}")


@sio.event
def sequence_analysis(
        pathogen_id, identifier, fasta_chunk, chunk_information, sequence_identifiers=None,
):
    """
    Collect fasta chunks for sequence analysis and init the analysis when all chunks were successfully transferred.

    Parameters:
        pathogen_id -- Postgres db id of the selected pathogen
        identifier -- Batch identifier for the transmitted batch of a fasta file in case of viral analyses
            and a pseudonymized sequence identifier in case of bacterial analyses
        fasta_chunk -- Chunk of a fasta file in case viral analyses and a chunk of a sequence in case of bacterial analyses
        chunk_information -- Dictionary containing information about the index of the transferred chunk
            and the total amount of chunks relating to the current analysis
        sequence_identifiers -- List of sequence identifiers in case of viral analyses
    """
    pathogen = Pathogen.query.get(pathogen_id)
    socket_id = request.sid
    fasta_chunk = fasta_chunk.replace("\r", "")

    # ensure pseudonymization of bacterial fasta assemblies by removing potentially included ids in headers
    if pathogen.type == "bacterial":
        fasta_chunk = re.sub(r"\>(.*?)\n", ">\n", fasta_chunk)
    persist_fasta_chunk(
        fasta_chunk, chunk_information, socket_id, identifier
    )

    fasta_content = get_merged_fasta_content_if_complete(socket_id, identifier, chunk_information)

    # prevent initialization of sequence analysis job in case the fasta content is not yet complete
    if not fasta_content:
        return

    init_sequence_analysis_job(socket_id, pathogen, identifier, fasta_content, sequence_identifiers)


def init_sequence_analysis_job(socket_id, pathogen, identifier, fasta_content, sequence_identifiers=None):
    """
    Instantiate a sequence analysis strategy depending on the type of the selected pathogen and enqueue a job.

    Parameters:
        socket_id -- Id of the websocket connection
        pathogen -- Selected pathogen
        identifier -- Batch identifier for the transmitted batch of a fasta file in case of viral analyses
            and a pseudonymized sequence identifier in case of bacterial analyses
        fasta_content -- Complete fasta content containing multiple sequences for viral analyses
            and a single sequence assembly for bacterial analyses
        sequence_identifiers -- List of sequence identifiers in case of viral analyses
    """
    strategy = ViralSequenceAnalysis(
        pathogen,
        identifier,
        sequence_identifiers,
        fasta_content,
        socket_id,
    ) if pathogen.type == "viral" else BacterialSequenceAnalysis(
        pathogen,
        identifier,
        fasta_content,
        socket_id,
    )
    strategy.enqueue_analysis(
        queue_viral if pathogen.type == "viral" else queue_bacterial,
    )
