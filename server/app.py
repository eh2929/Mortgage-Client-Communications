#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, abort, jsonify, make_response, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_login import current_user, LoginManager
from sqlalchemy.orm import joinedload
from models import User, Loan_Application, Task, Assigned_Task, Comment
from werkzeug.exceptions import NotFound, Unauthorized

# Local imports
from config import app, db, api

# Initialize Api
api = Api(app)

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
def index():
    return "<h1>Project Server</h1>"


# @app.before_request
# def check_if_logged_in():
#     open_access_list = ["", "signup", "login", "logout", "authorized"]
#     if request.endpoint not in open_access_list:
#         if (
#             "user_id" not in session
#             or db.session.get(User, session["user_id"]).role != "admin"
#         ):
#             return make_response(
#                 {
#                     "error:": "Unauthorized: you must be logged in to access this resource"
#                 },
#                 401,
#             )


class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get("user_id")).first()
        if not user:
            return make_response(
                {
                    "error:": "Unauthorized: you must be logged in to access this resource"
                },
                401,
            )
        else:
            return make_response(user.to_dict(), 200)


api.add_resource(CheckSession, "/check_session", endpoint="check_session")


# User class view
class Users(Resource):
    # Get all users - works
    def get(self):
        role = request.args.get("role")
        query = User.query
        if role:
            query = query.filter(User.role == role)
        users = [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number,
                "username": user.username,
                "password": user.password_hash,
                "role": user.role,
            }
            for user in query.all()
        ]
        return make_response(users, 200)

    # Create a new user - works
    def post(self):
        req_data = request.get_json()
        role_mapping = {
            "loan_officer": "loan officer",
            "real_estate_agent": "real estate agent",
            "borrower": "borrower",
            "admin": "admin",
        }
        try:
            new_user = User(
                name=req_data["name"],
                email=req_data["email"],
                password=req_data["password"],
                phone_number=req_data["phone"],
                username=req_data["username"],
                role=role_mapping.get(req_data["role"], req_data["role"]),
            )
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_user)
        db.session.commit()
        # this is the line that sets the session and logs in the user
        session["user_id"] = new_user.id
        return make_response(new_user.to_dict(), 201)


api.add_resource(Users, "/users", "/signup")


# login
@app.route("/login", methods=["POST"])
def login():
    request_data = request.get_json()
    print("Request data: ", request_data)  # log the request data
    user = User.query.filter_by(username=request.get_json()["username"]).first()
    print("User: ", user)  # log the user
    if user:
        is_authenticated = user.authenticate(request.get_json()["password"])
        print("Is authenticated:", is_authenticated)  # log the authentication result
        if is_authenticated:
            session["user_id"] = user.id
            return make_response(user.to_dict(), 200)
    raise Unauthorized("Invalid credentials")


# route that checks to see if the User is currently in sessions
def authorized():
    user = User.query.filter_by(id=session.get("user_id")).first()
    if not user:
        raise Unauthorized("Invalid credentials")
    return make_response(user.to_dict(), 200)


# logout
@app.route("/logout", methods=["DELETE"])
def logout():
    session.clear()
    return make_response({}, 204)


# User by ID view - works
class UsersById(Resource):
    def get(self, id):  # tested - works
        user = User.query.filter(User.id == id).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "User not found"}, 404)

    def delete(self, id):  # tested - works
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response({"message": "User deleted successfully"}, 200)

    def patch(self, id):  # tested - works
        user = User.query.filter(User.id == id).first()
        req_data = request.get_json()
        if not user:
            return make_response({"error": "User not found"}, 404)
        try:
            for key, value in req_data.items():
                setattr(user, key, value)
        except:
            return make_response({"error": "Invalid data"}, 400)
        db.session.commit()
        return make_response(user.to_dict(), 200)


api.add_resource(UsersById, "/users/<int:id>")


# Loan_Application class view
class LoanApplications(Resource):
    # Get all loan applications
    def get(self):
        # if current_user.is_authenticated:
        #     if current_user.role == "admin":
        loan_applications_query = Loan_Application.query.all()
        # else:
        #     loan_applications_query = Loan_Application.query.filter_by(
        #         borrower_id=current_user.id
        #     ).all()

        loan_applications = [
            {
                "id": loan_app.id,
                "property_address": loan_app.property_address,
                "borrower_name": (
                    loan_app.borrower.name if loan_app.borrower else None
                ),
                "assigned_loan_officer": (
                    db.session.get(User, loan_app.loan_officer_id).name
                    if loan_app.loan_officer_id
                    else None
                ),
                "assigned_real_estate_agent": (
                    db.session.get(User, loan_app.real_estate_agent_id).name
                    if loan_app.real_estate_agent_id
                    else None
                ),
            }
            for loan_app in loan_applications_query
        ]
        return make_response(loan_applications, 200)
        # else:
        #     pass
        # return make_response({"error": "User not authenticated"}, 401)

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
    def get(self, id):  # tested - works
        loan_app = Loan_Application.query.filter(Loan_Application.id == id).first()
        if loan_app:
            return make_response(loan_app.to_dict(), 200)
        else:
            return make_response({"error": "Loan Application not found"}, 404)

    def delete(self, id):  # tested - works
        loan_app = Loan_Application.query.filter(Loan_Application.id == id).first()
        if not loan_app:
            return make_response({"error": "Loan Application not found"}, 404)
        db.session.delete(loan_app)
        db.session.commit()
        return make_response({"message": "Loan Application deleted successfully"}, 200)

    def patch(self, id):  # tested - works
        loan_app = Loan_Application.query.filter(Loan_Application.id == id).first()
        req_data = request.get_json()
        if not loan_app:
            return make_response({"error": "Loan Application not found"}, 404)
        try:
            for key, value in req_data.items():
                setattr(loan_app, key, value)
        except:
            return make_response({"error": "Invalid data"}, 400)
        db.session.commit()
        return make_response(loan_app.to_dict(), 200)


api.add_resource(LoanApplicationsById, "/loan_applications/<int:id>")


# Task class view
class Tasks(Resource):
    # Get all tasks - WORKS
    def get(self):
        tasks = [
            {"id": task.id, "name": task.name, "description": task.description}
            for task in Task.query.all()
        ]
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
    def get(self, id):  # tested - works
        task = Task.query.filter(Task.id == id).first()
        if task:
            return make_response(task.to_dict(), 200)
        else:
            return make_response({"error": "Task not found"}, 404)

    def delete(self, id):  # tested - works
        task = Task.query.filter(Task.id == id).first()
        if not task:
            return make_response({"error": "Task not found"}, 404)
        db.session.delete(task)
        db.session.commit()
        return make_response({"message": "Task deleted successfully"}, 200)

    def patch(self, id):  # tested - works
        task = Task.query.filter(Task.id == id).first()
        req_data = request.get_json()
        if not task:
            return make_response({"error": "Task not found"}, 404)
        try:
            for key, value in req_data.items():
                setattr(task, key, value)
        except:
            return make_response({"error": "Invalid data"}, 400)
        db.session.commit()
        return make_response(task.to_dict(), 200)


api.add_resource(TasksById, "/tasks/<int:id>")


# Assigned_Task view
class AssignedTasks(Resource):
    # Get all assigned tasks
    def get(self):
        loanId = request.args.get("loanId")
        if loanId is not None:
            assigned_tasks = (
                Assigned_Task.query.filter_by(loan_application_id=loanId)
                .options(joinedload(Assigned_Task.task))
                .all()
            )
        else:
            assigned_tasks = Assigned_Task.query.options(
                joinedload(Assigned_Task.task)
            ).all()
        return make_response(
            [assigned_task.serialize() for assigned_task in assigned_tasks], 200
        )

    # Create a new assigned task - WORKS

    def post(self):
        req_data = request.get_json()
        req_data.pop("name", None)
        req_data.pop("description", None)
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
    def get(self, id):  # tested - works
        assigned_task = Assigned_Task.query.filter(Assigned_Task.id == id).first()
        if assigned_task:
            return make_response(assigned_task.to_dict(), 200)
        else:
            return make_response({"error": "Assigned Task not found"}, 404)

    def delete(self, id):  # tested - works
        assigned_task = Assigned_Task.query.filter(Assigned_Task.id == id).first()
        if not assigned_task:
            return make_response({"error": "Assigned Task not found"}, 404)
        db.session.delete(assigned_task)
        db.session.commit()
        return make_response({"message": "Assigned Task deleted successfully"}, 200)

    def patch(self, id):  # tested - works
        assigned_task = Assigned_Task.query.filter(Assigned_Task.id == id).first()
        req_data = request.get_json()
        if not assigned_task:
            return make_response({"error": "Assigned Task not found"}, 404)
        try:
            for key, value in req_data.items():
                setattr(assigned_task, key, value)
        except:
            return make_response({"error": "Invalid data"}, 400)
        db.session.commit()
        return make_response(assigned_task.to_dict(), 200)


api.add_resource(AssignedTasksById, "/assigned_tasks/<int:id>")


# Comment class view
class Comments(Resource):
    # Get all comments
    def get(self):
        loanId = request.args.get("loanId")
        if loanId is not None:
            comments = Comment.query.filter_by(loan_application_id=loanId).all()
        else:
            comments = Comment.query.all()
        return make_response([comment.to_dict() for comment in comments], 200)

    # Create a new comment - WORKS
    def post(self):
        req_data = request.get_json()
        if "loan_application_id" not in req_data:
            return make_response({"error": ["loan_application_id is required"]}, 400)
        if "user_id" not in req_data:
            return make_response({"error": ["user_id is required"]}, 400)
        try:
            new_comment = Comment(**req_data)
        except ValueError as e:
            return make_response({"error": ["validation errors"]}, 400)
        db.session.add(new_comment)
        db.session.commit()
        return make_response(new_comment.to_dict(), 201)


api.add_resource(Comments, "/comments")


# Comments by ID view
class CommentsById(Resource):
    def get(self, id):  # tested - works
        comment = Comment.query.filter(Comment.id == id).first()
        if comment:
            return make_response(comment.to_dict(), 200)
        else:
            return make_response({"error": "Comment not found"}, 404)

    def delete(self, id):  # tested - works
        comment = Comment.query.filter(Comment.id == id).first()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        db.session.delete(comment)
        db.session.commit()
        return make_response({"message": "Comment deleted successfully"}, 200)

    def patch(self, id):  # tested - works
        comment = Comment.query.filter(Comment.id == id).first()
        req_data = request.get_json()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        try:
            for key, value in req_data.items():
                setattr(comment, key, value)
        except:
            return make_response({"error": "Invalid data"}, 400)
        db.session.commit()
        return make_response(comment.to_dict(), 200)


api.add_resource(CommentsById, "/comments/<int:id>")


# Create admin user
def create_admin_user():
    with app.app_context():
        admin = User.query.filter_by(username="admin").first()
        if not admin:
            admin = User(
                name="admin",
                email="admin@example.com",
                password="password",
                phone_number="1234567890",
                username="admin",
                role="admin",
            )
            db.session.add(admin)
            db.session.commit()


@app.cli.command("createadmin")
def create_admin_command():
    create_admin_user()


if __name__ == "__main__":
    app.run(port=5555, debug=True)
