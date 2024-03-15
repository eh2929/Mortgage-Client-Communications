from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import relationship

from config import db

# Models go here!


# Define User Model
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    phone_number = db.Column(db.String)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)
    role = db.Column(db.String)

    # Define relationships
    loan_applications = db.relationship(
        "Loan_Application", backref="users", secondary="assigned_tasks"
    )
    comments = db.relationship("Comment", backref="user")


# Define loan_application model
class Loan_Application(db.Model, SerializerMixin):
    __tablename__ = "loan_applications"

    id = db.Column(db.Integer, primary_key=True)
    property_address = db.Column(db.String)
    borrower_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_officer_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    real_estate_agent_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    lending_agency_id = db.Column(db.Integer, db.ForeignKey("lending_agencies.id"))
    loan_program_id = db.Column(db.Integer, db.ForeignKey("loan_programs.id"))

    # Define relationships
    lending_agency = db.relationship("Lending_Agency", backref="loan_applications")
    assigned_tasks = db.relationship("Assigned_Task", backref="loan_application")
    comments = db.relationship("Comment", backref="loan_application")


# Define Tasks model
class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    # Define relationships
    assigned_tasks = db.relationship("Assigned_Task", backref="task")


# Define Assigned_Tasks model
class Assigned_Task(db.Model, SerializerMixin):
    __tablename__ = "assigned_tasks"

    id = db.Column(db.Integer, primary_key=True)
    assigned_date = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)
    is_completed = db.Column(db.Boolean)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))


# Define Lending_Agency model
class Lending_Agency(db.Model, SerializerMixin):
    __tablename__ = "lending_agencies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)


# Define Comments model
class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))


# Define Loan_Program model
class Loan_Program(db.Model, SerializerMixin):
    __tablename__ = "loan_programs"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)  # 'Conventional', 'FHA', 'VA', 'USDA', 'NonQM'
    loan_applications = db.relationship("Loan_Application", backref="loan_program")
