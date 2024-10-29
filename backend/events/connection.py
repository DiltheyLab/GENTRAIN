from flask import request
from flask_socketio import leave_room, join_room
from backend.server import sio, redis_connection


@sio.event
def join_viral(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    join_room(f"viral_{socket_id}")
    sio.emit(
        "viral_room_created",
        f"viral_{socket_id}",
        to=f"viral_{socket_id}",
    )
    print(f"viral_{socket_id} created")


@sio.event
def join_bacterial(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    join_room(f"bacterial_{socket_id}")
    sio.emit(
        "bacterial_room_created",
        f"bacterial_{socket_id}",
        to=f"bacterial_{socket_id}",
    )
    print(f"bacterial_{socket_id} created")


@sio.event
def leave_viral():
    socket_id = request.sid
    leave_room(f"viral_{socket_id}")
    print(f"viral_{socket_id} closed")


@sio.event
def leave_bacterial():
    socket_id = request.sid
    leave_room(f"bacterial_{socket_id}")
    print(f"bacterial_{socket_id} closed")


@sio.event
def init_gentrain_session(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
