@echo off
cd documentation
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
mkdocs serve