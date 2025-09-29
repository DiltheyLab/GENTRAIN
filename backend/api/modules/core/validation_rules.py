import json
import re

def valid_sequence_id_in_fasta(string):
    # fasta ids must be set
    return re.compile(r"^[A-Za-z0-9-_.]+$").match(string)

def valid_sequence(string):
    return re.compile(r"^[ATGCRYSWKMBDHVNXU\n>]+$").match(string)

def valid_json(file):
    try:
        json.loads(file)
        return True
    except json.JSONDecodeError:
        return False