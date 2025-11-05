import json
import re
from flask import jsonify, abort
from prisma.models import Pathogen
from flask import request
from flask_socketio import leave_room, join_room
from src.server import redis_connection, sio
from src.domains.sequence_analysis.redis_actions import (
    get_merged_fasta_content_if_complete,
    persist_fasta_chunk, enqueue_sequence_analysis_job,
)

def get_sequence_analysis_result_action(fasta_hash: str):
    sequence_analysis = redis_connection.hgetall(
        f"client:sequence_analysis:{fasta_hash}"
    )
    if not sequence_analysis:
        abort(422)
    if "enqueued_at" not in sequence_analysis:
        redis_connection.delete(f"client:sequence_analysis:{fasta_hash}")
        abort(422)
    if "result" not in sequence_analysis:
        return jsonify(None)
    return jsonify(json.loads(sequence_analysis["result"]))

def delete_sequence_analysis_result_action(fasta_hash: str):
    redis_connection.delete(f"client:sequence_analysis:{fasta_hash}")
    return jsonify([])


def join_sequence_analysis_room_action(pathogen_type):
    """
    Join a sequence analysis room and remember the session id by mapping it to the connections socket id.

    pathogen_type: Type of the selected pathogen (viral | bacterial)
    """
    socket_id = request.sid
    join_room(f"{pathogen_type}_{socket_id}")
    sio.emit(
        f"{pathogen_type}_room_created",
        f"{pathogen_type}_{socket_id}",
        to=f"{pathogen_type}_{socket_id}",
    )

def leave_sequence_analysis_room_action(pathogen_type):
    """
    Leave a sequence analysis room.
    Parameters:
        pathogen_type -- Type of the selected pathogen (viral | bacterial)
    """
    socket_id = request.sid
    leave_room(f"{pathogen_type}_{socket_id}")


def init_sequence_analysis_action(fasta_chunk, chunk_information, pathogen_id, fasta_hash=None):
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
