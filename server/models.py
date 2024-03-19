from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship, validates, backref
from config import db


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone_number = db.Column(db.String, unique=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    role = db.Column(db.String)

    # User (Borrower) has many loan applications
    borrower_loans = db.relationship(
        "Loan_Application",
        back_populates="borrower",
        foreign_keys="Loan_Application.borrower_id",
    )
    # User has many comments
    comments = db.relationship("Comment", back_populates="user")
    serialize_rules = (
        "-comments.user",
        "-comments.loan_application",
        "-borrower_loans.borrower",
        "-borrower_loans.comments",
        "-borrower_loans.assigned_tasks",
    )


class Loan_Application(db.Model, SerializerMixin):
    __tablename__ = "loan_applications"

    id = db.Column(db.Integer, primary_key=True)
    property_address = db.Column(db.String, unique=True)
    borrower_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_officer_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    real_estate_agent_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Loan Application belongs to a borrower
    borrower = db.relationship(
        "User", back_populates="borrower_loans", foreign_keys=[borrower_id]
    )

    # Loan Application has many comments
    comments = db.relationship("Comment", back_populates="loan_application")

    # Loan Application has many assigned tasks
    assigned_tasks = db.relationship("Assigned_Task", back_populates="loan_application")

    serialize_rules = (
        "-comments.loan_application",
        "-comments.user",
        "-assigned_tasks.loan_application",
        "-borrower.borrower_loans",
        "-borrower.comments",
    )


class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    # Task has many assigned tasks
    assigned_tasks = db.relationship("Assigned_Task", back_populates="task")
    serialize_rules = ("-assigned_tasks.task",)


class Assigned_Task(db.Model, SerializerMixin):
    __tablename__ = "assigned_tasks"

    id = db.Column(db.Integer, primary_key=True)
    assigned_date = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)
    is_completed = db.Column(db.Boolean)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))

    # Assigned Task belongs to a task
    task = db.relationship("Task", back_populates="assigned_tasks")
    serialize_rules = ("-task.assigned_tasks",)

    # Many Assigned Tasks belong to a loan application
    loan_application = db.relationship(
        "Loan_Application", back_populates="assigned_tasks"
    )

    serialize_rules = ("-loan_application.comments", "-loan_application.assigned_tasks")


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    loan_application_id = db.Column(db.Integer, db.ForeignKey("loan_applications.id"))

    # Comment belongs to a user
    user = db.relationship("User", back_populates="comments")

    # Many comments belong to a loan application
    loan_application = db.relationship("Loan_Application", back_populates="comments")
    serialize_rules = (
        "-user.comments",
        "-user.borrower_loans",
        "-loan_application.comments",
        "-loan_application.assigned_tasks",
    )
