@echo off
cd documentation
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
mkdocs serve
cd ..
rm -rf backend/static/docs
mkdir backend/static/docs
mv documentation/site/* backend/static/docs