from prisma.models import pathogen as Pathogen
from src.domains.sequence_analysis.controllers.sequence_analysis_controller import (
    init_sequence_analysis_action,
    join_sequence_analysis_room_action,
    leave_sequence_analysis_room_action
)
from src.server import sio


@sio.event
def join_sequence_analysis_room(pathogen_type):
    join_sequence_analysis_room_action(pathogen_type)


@sio.event
def leave_sequence_analysis_room(pathogen_type):
    leave_sequence_analysis_room_action(pathogen_type)


@sio.event
def init_sequence_analysis(fasta_chunk, chunk_information, pathogen_id, fasta_hash=None):
    init_sequence_analysis_action(fasta_chunk, chunk_information, pathogen_id, fasta_hash)

