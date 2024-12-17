import re


def valid_case_id(string):
    return re.compile(r"^[A-Za-z0-9-]+$").match(string)


def valid_sequence_id_in_csv(string):
    # fasta ids might be empty (*) for cases that are not sequenced
    return re.compile(r"^[A-Za-z0-9-_]*$").match(string)


def valid_sequence_id_in_fasta(string):
    # fasta ids must be set
    return re.compile(r"^[A-Za-z0-9-_]+$").match(string)


def valid_date(string):
    return re.compile(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$").match(string)


def valid_text(string):
    return re.compile(r"^[A-Za-z0-9äöüÄÖÜß,() ]*$").match(string)


def valid_sequence(string):
    return re.compile(r"^[ATGCRYSWKMBDHVNXU\n>]+$").match(string)
