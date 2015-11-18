#!/bin/bash
virtualenv env
. env/bin/activate
pip install flask
python -m py_compile app.py
#jdlejdl
