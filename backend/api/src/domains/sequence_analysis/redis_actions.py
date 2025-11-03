from src.server import redis_connection

def persist_fasta_chunk(fasta_chunk, socket_id, chunk_information):
    """
    Write a fasta chunk into the redis cache.

    Parameters:
        fasta_chunk -- Chunk of a fasta file in case viral analyses and a chunk of a sequence in case of bacterial analyses
        chunk_information -- Dictionary containing information about the chunking id, the index of the transferred chunk
            and the total amount of chunks relating to the current analysis
        socket_id -- Id of the websocket connection
        sequence_chunk -- Hash of the complete genomic fasta content
    """
    redis_connection.set(
        name=f"chunks:{socket_id}:{chunk_information['id']}:{chunk_information['index']}",
        value=fasta_chunk,
    )
    redis_connection.expire(
        name=f"chunks:{socket_id}:{chunk_information['id']}:{chunk_information['index']}",
        time=60,
    )



def get_merged_fasta_content_if_complete(socket_id, chunk_information):
    """
    Merge entire fasta file content into a string if all chunks were successfully transferred.

     Parameters:
         socket_id -- Id of the websocket connection
         chunk_information -- Dictionary containing information about the chunking id, the index of the transferred chunk
             and the total amount of chunks relating to the current analysis
    """
    chunk_keys = get_persisted_fasta_chunk_keys(socket_id, chunk_information)
    if chunk_information["total"] > len(chunk_keys):
        return
    fasta_content = ""
    for index, key in enumerate(chunk_keys):
        fasta_chunk = redis_connection.get(key)
        # if messages arrive simultaneously two processes might try to retrieve the entire fasta content from redis cache
        # in this case we interrupt the latter one
        if not fasta_chunk:
            return
        # delete the key allocated to the fasta chunk from redis
        redis_connection.delete(key)
        fasta_content += fasta_chunk
    return fasta_content


def get_persisted_fasta_chunk_keys(socket_id, chunk_information):
    """
    Get all keys of persisted fasta chunks for the provided identifier.

    Parameters:
        socket_id --  Id of the websocket connection
        chunk_information -- Dictionary containing information about the chunking id, the index of the transferred chunk
            and the total amount of chunks relating to the current analysis
    """
    chunk_keys = redis_connection.keys(
        f"chunks:{socket_id}:{chunk_information['id']}:*"
    )
    chunk_keys.sort()
    return chunk_keys