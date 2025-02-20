cases_example_data_fields = {
        "case_id": {
            "required": True,
            "flexible": False,
            "name": "Fall ID",
            "pattern": r"^[A-Za-z0-9-]+$"
        },
        "registered_at": {
            "required": True,
            "flexible": False,
            "name": "Registrierungsdatum",
            "pattern": r"^(0[1-9]|[1-9]|[12][0-9]|3[01])\.(0[1-9]|[1-9]|1[0-2])\.(\d{4})$"
        },
        "sequence_id": {
            "required": False,
            "flexible": False,
            "name": "Sequenz ID",
            "pattern": r"^[A-Za-z0-9-_]*$"
        },
        "outbreak": {
            "required": False,
            "flexible": False,
            "name": "Ausbruch",
            "pattern": r"^[A-Za-z0-9äöüÄÖÜß,() ]*$"
        },
        "first_name": {
            "required": False,
            "flexible": False,
            "name": "Vorname",
            "pattern": r"^[A-Za-z]*$"
        },
        "last_name": {
            "required": False,
            "flexible": False,
            "name": "Nachname",
            "pattern": r"^[A-Za-z]*$"
        },
        "zip_code": {
            "required": False,
            "flexible": False,
            "name": "PLZ",
            "pattern": r"^\d{5}$"
        },
        "city": {
            "required": False,
            "flexible": False,
            "name": "Ort",
            "pattern": r"^[A-Za-z- ]*$"
        },
        "street": {
            "required": False,
            "flexible": False,
            "name": "Straße",
            "pattern": r"^[0-9A-Za-z.- ]*$"
        },
        "infected_by": {
            "required": False,
            "flexible": False,
            "name": "Angesteckt bei",
            "pattern": r"^[A-Za-z0-9-]*$"
        },
        "category": {
            "required": False,
            "flexible": True,
            "name": "Kategorie",
            "pattern": r"^[A-Za-z0-9- ]*$"
        },
    }