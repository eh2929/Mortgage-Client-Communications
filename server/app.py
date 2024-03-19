#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import User, Loan_Application, Task, Assigned_Task, Comment

# Local imports
from config import app, db, api

# Add your model imports


# Initialize Api
api = Api(app)

# Views go here!


# base view
@app.route("/")
def index():
    return "<h1>Project Server</h1>"


# User class view
class Users(Resource):

    # Get all users - test
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

    # Create a new user - test
    def post(self):
        req_data = request.get_json()
        try:
            new_user = User(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)


api.add_resource(Users, "/users")


# User by ID view
class UsersById(Resource):
    pass


# Loan_Application class view
class LoanApplications(Resource):
    # Get all loan applications - WORKS
    def get(self):
        loan_applications = [
            loan_app.to_dict() for loan_app in Loan_Application.query.all()
        ]
        return make_response(loan_applications, 200)

    # Create a new loan application - WORKS
    def post(self):
        req_data = request.get_json()
        try:
            new_loan_app = Loan_Application(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_loan_app)
        db.session.commit()
        return make_response(new_loan_app.to_dict(), 201)


api.add_resource(LoanApplications, "/loan_applications")


# Loan_Application by ID view
class LoanApplicationsById(Resource):
    pass


# Task class view
class Tasks(Resource):
    # Get all tasks - WORKS
    def get(self):
        tasks = [task.to_dict() for task in Task.query.all()]
        return make_response(tasks, 200)

    # Create a new task - WORKS
    def post(self):
        req_data = request.get_json()
        try:
            new_task = Task(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_task)
        db.session.commit()
        return make_response(new_task.to_dict(), 201)


api.add_resource(Tasks, "/tasks")


# Task by ID view
class TasksById(Resource):
    pass


# Assigned_Task view
class AssignedTasks(Resource):
    # Get all assigned tasks - WORKS
    def get(self):
        assigned_tasks = [
            assigned_task.to_dict() for assigned_task in Assigned_Task.query.all()
        ]
        return make_response(assigned_tasks, 200)

    # Create a new assigned task - WORKS
    def post(self):
        req_data = request.get_json()
        try:
            new_assigned_task = Assigned_Task(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_assigned_task)
        db.session.commit()
        return make_response(new_assigned_task.to_dict(), 201)


api.add_resource(AssignedTasks, "/assigned_tasks")


# Assigned_Task by ID view
class AssignedTasksById(Resource):
    pass


# Comment class view
class Comments(Resource):
    # Get all comments - WORKS
    def get(self):
        comments = [comment.to_dict() for comment in Comment.query.all()]
        return make_response(comments, 200)

    # Create a new comment - WORKS
    def post(self):
        req_data = request.get_json()
        try:
            new_comment = Comment(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_comment)
        db.session.commit()
        return make_response(new_comment.to_dict(), 201)


api.add_resource(Comments, "/comments")

if __name__ == "__main__":
    app.run(port=5555, debug=True)
