from config import app, db
from models import User, Loan_Application, Task, Assigned_Task, Comment
from datetime import datetime


def seed_data():
    with app.app_context():
        # Create Users
        user1 = User(
            name="John Doe",
            email="john@example.com",
            phone_number="1234567890",
            username="johndoe",
            password="password",
            role="borrower",
        )
        user2 = User(
            name="Jane Smith",
            email="jane@example.com",
            phone_number="9876543210",
            username="janesmith",
            password="password",
            role="loan_officer",
        )
        user3 = User(
            name="Bob Johnson",
            email="bob@example.com",
            phone_number="5555555555",
            username="bob",
            password="password",
            role="real_estate_agent",
        )

        # Add Users to the session
        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)

        # Commit the session to generate user IDs
        db.session.commit()

        # Create Loan Applications
        loan1 = Loan_Application(
            property_address="123 Main St.",
            borrower_id=user1.id,
            loan_officer_id=user2.id,
            real_estate_agent_id=user3.id,
        )
        loan2 = Loan_Application(
            property_address="456 Elm St.",
            borrower_id=user2.id,
            loan_officer_id=user1.id,
            real_estate_agent_id=user3.id,
        )

        # Add Loan Applications to the session
        db.session.add(loan1)
        db.session.add(loan2)

        # Create Tasks
        task1 = Task(name="Task 1", description="Description for Task 1")
        task2 = Task(name="Task 2", description="Description for Task 2")

        # Add Tasks to the session
        db.session.add(task1)
        db.session.add(task2)

        # Commit the session to generate loan application IDs
        db.session.commit()

        # Create Assigned Tasks
        assigned_task1 = Assigned_Task(
            assigned_date=datetime.now(),
            due_date=datetime.now(),
            is_completed=False,
            task_id=task1.id,
            loan_application_id=loan1.id,
        )
        assigned_task2 = Assigned_Task(
            assigned_date=datetime.now(),
            due_date=datetime.now(),
            is_completed=False,
            task_id=task2.id,
            loan_application_id=loan2.id,
        )

        # Add Assigned Tasks to the session
        db.session.add(assigned_task1)
        db.session.add(assigned_task2)

        # Create Comments
        comment1 = Comment(
            comment="This is a comment.",
            date=datetime.now(),
            user_id=user1.id,
            loan_application_id=loan1.id,
        )
        comment2 = Comment(
            comment="Another comment here.",
            date=datetime.now(),
            user_id=user2.id,
            loan_application_id=loan2.id,
        )

        # Add Comments to the session
        db.session.add(comment1)
        db.session.add(comment2)

        # Commit the session
        db.session.commit()


if __name__ == "__main__":
    seed_data()
