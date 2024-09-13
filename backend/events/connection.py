from backend.server import sio, redis_connection


@sio.event
def connect(socket_id, environ, auth):
    redis_connection.set(f"client:connected:{socket_id}", 1)


@sio.event
def reconnect(socket_id, environ, auth):
    redis_connection.set(f"client:connected:{socket_id}", 1)


@sio.event
def disconnect(socket_id):
    redis_connection.delete(f"client:connected:{socket_id}")


@sio.event
def join_viral(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    sio.enter_room(socket_id, f"viral_{socket_id}")
    sio.emit(
        "viral_room_created",
        f"viral_{socket_id}",
        room=f"viral_{socket_id}",
    )
    print(f"viral_{socket_id} created")


@sio.event
def join_bacterial(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    sio.enter_room(socket_id, f"bacterial_{socket_id}")
    sio.emit(
        "bacterial_room_created",
        f"bacterial_{socket_id}",
        room=f"bacterial_{socket_id}",
    )
    print(f"bacterial_{socket_id} created")


@sio.event
def leave_viral(socket_id):
    sio.leave_room(socket_id, f"viral_{socket_id}")
    print(f"viral_{socket_id} closed")


@sio.event
def leave_bacterial(socket_id):
    sio.leave_room(socket_id, f"bacterial_{socket_id}")
    print(f"bacterial_{socket_id} closed")


@sio.event
def init_gentrain_session(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
