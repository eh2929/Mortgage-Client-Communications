from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship, validates, backref
from config import db


# Define User Model
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone_number = db.Column(db.String, unique=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    role = db.Column(db.String)

    # Define relationships
    # A user can have many loan applications
    # There are 3 user roles: 'borrower', 'loan_officer', 'real_estate_agent'
    borrower_loans = db.relationship(
        "Loan_Application",
        back_populates="user",
        foreign_keys="Loan_Application.borrower_id",
    )
    loan_officer_loans = db.relationship(
        "Loan_Application",
        back_populates="user",
        foreign_keys="Loan_Application.loan_officer_id",
    )
    agent_loans = db.relationship(
        "Loan_Application",
        back_populates="user",
        foreign_keys="Loan_Application.real_estate_agent_id",
    )

    # A user can have many comments

    # Define Serialization Rules
    serialize_rules = (
        "-borrower_loans.user",
        "-loan_officer_loans.user",
        "-agent_loans.user",
    )
    # Define Validation Rules


# Define loan_application model
class Loan_Application(db.Model, SerializerMixin):
    __tablename__ = "loan_applications"

    id = db.Column(db.Integer, primary_key=True)
    property_address = db.Column(db.String, unique=True)
    # Foreign Keys
    borrower_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_officer_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    real_estate_agent_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Define relationships

    # A loan application can have many assigned tasks

    # A loan application can have many comments

    # A loan application can have many users, each with a different role
    user = db.relationship(
        "User",
        back_populates="borrower_loans",
        foreign_keys="Loan_Application.borrower_id",
    )
    user = db.relationship(
        "User",
        back_populates="loan_officer_loans",
        foreign_keys="Loan_Application.loan_officer_id",
    )
    user = db.relationship(
        "User",
        back_populates="agent_loans",
        foreign_keys="Loan_Application.real_estate_agent_id",
    )

    # Define Serialization Rules

    # Define Validation Rules


# Define Tasks model
class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    # Define relationships
    # A task can have many assigned tasks

    # Define Serialization Rules

    # Define Validation Rules


# Define Assigned_Tasks model
class Assigned_Task(db.Model, SerializerMixin):
    __tablename__ = "assigned_tasks"

    id = db.Column(db.Integer, primary_key=True)
    assigned_date = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)
    is_completed = db.Column(db.Boolean)

    # Foreign Keys
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))

    # Define relationships
    # A loan application can have many assigned tasks

    # An assigned task can have one task and one loan application

    # Define Serialization Rules

    # Define Validation Rules


# Define Comments model
class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    date = db.Column(db.DateTime)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))

    # Define relationships
    # A comment can have one user

    # A comment can have one loan application

    # Define Serialization Rules

    # Define Validation Rules
