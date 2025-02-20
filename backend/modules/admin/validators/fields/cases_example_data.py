cases_example_data_fields = {
        "Fall ID": {
            "required": True,
            "flexible": False,
            "pattern": r"^[A-Za-z0-9\-]+$"
        },
        "Registrierungsdatum": {
            "required": True,
            "flexible": False,
            "pattern": r"^(0[1-9]|[1-9]|[12][0-9]|3[01])\.(0[1-9]|[1-9]|1[0-2])\.(\d{4})$"
        },
        "Sequenz ID": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-z0-9\-\_]*$"
        },
        "Ausbruch": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-z0-9äöüÄÖÜß\,\(\)\s]*$"
        },
        "Vorname": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-zäöüÄÖÜß\-\s]*$"
        },
        "Nachname": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-zäöüÄÖÜß\-\s]*$"
        },
        "PLZ": {
            "required": False,
            "flexible": False,
            "pattern": r"^\d{5}$"
        },
        "Ort": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-zäöüÄÖÜß\-\s]*$"
        },
        "Straße": {
            "required": False,
            "flexible": False,
            "pattern": r"^[0-9A-Za-zäöüÄÖÜß\.\-\s]*$"
        },
        "Angesteckt bei": {
            "required": False,
            "flexible": False,
            "pattern": r"^[A-Za-z0-9\-]*$"
        },
        "Kategorie": {
            "required": False,
            "flexible": True,
            "pattern": r"^[A-Za-z0-9äöüÄÖÜß\-\s]*$"
        },
    }