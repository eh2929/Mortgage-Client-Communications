#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate

# Local imports
from config import app, db, api

# Add your model imports
from models import (
    User,
    Loan_Application,
    Task,
    Assigned_Task,
    Comment,
    Lending_Agency,
    Loan_Program,
)

# Initialize Api
api = Api(app)

# Views go here!

# base view
@app.route("/")
def index():
    return "<h1>Project Server</h1>"

# User class view
class Users(Resource):
    pass


if __name__ == "__main__":
    app.run(port=5555, debug=True)
