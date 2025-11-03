from flask import request
from flask_socketio import leave_room, join_room
from src.server import sio


@sio.event
def join_sequence_analysis_room(pathogen_type):
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


@sio.event
def leave_sequence_analysis_room(pathogen_type):
    """
    Leave a sequence analysis room.
    Parameters:
        pathogen_type -- Type of the selected pathogen (viral | bacterial)
    """
    socket_id = request.sid
    leave_room(f"{pathogen_type}_{socket_id}")
