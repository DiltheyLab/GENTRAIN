#!/bin/bash

cd documentation
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
mkdocs build
cd ..
rm -rf backend/static/docs
mkdir backend/static/docs
mv documentation/site/* backend/static/docs