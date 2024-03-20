from models import User, Loan_Application, Task, Assigned_Task, Comment
from config import db, Bcrypt, app
from datetime import datetime, timedelta

bcrypt = Bcrypt()


def seed_data():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # Create users
    borrowers = [
        User(
            name=f"Borrower {i}",
            email=f"borrower{i}@example.com",
            phone_number=f"12345678{i}0",
            username=f"borrower{i}",
            role="borrower",
        )
        for i in range(1, 4)
    ]

    for borrower in borrowers:
        borrower.set_password("password123")

    loan_officer = User(
        name="Loan Officer",
        email="loanofficer@example.com",
        phone_number="5566778899",
        username="loanofficer",
        role="loan officer",
    )
    loan_officer.set_password("password123")

    real_estate_agent = User(
        name="Real Estate Agent",
        email="realestateagent@example.com",
        phone_number="9988776655",
        username="realestateagent",
        role="real estate agent",
    )
    real_estate_agent.set_password("password123")

    db.session.add_all(borrowers)
    db.session.add(loan_officer)
    db.session.add(real_estate_agent)
    db.session.commit()

    # Create loan applications
    for i, borrower in enumerate(borrowers, start=1):
        loan_app = Loan_Application(
            property_address=f"123 Main St {i}",
            borrower_id=borrower.id,
            loan_officer_id=loan_officer.id,
            real_estate_agent_id=real_estate_agent.id,
        )
        db.session.add(loan_app)

    db.session.commit()

    # Create tasks
    tasks = [
        Task(name=f"Task {i}", description=f"This is task {i}") for i in range(1, 4)
    ]

    db.session.add_all(tasks)
    db.session.commit()

    # Create assigned tasks
    for i, task in enumerate(tasks, start=1):
        assigned_task = Assigned_Task(
            assigned_date=datetime.now(),
            due_date=datetime.now() + timedelta(days=i),
            is_completed=False,
            task_id=task.id,
            loan_application_id=i,
        )
        db.session.add(assigned_task)

    db.session.commit()

    # Create comments
    for i, borrower in enumerate(borrowers, start=1):
        comment = Comment(
            comment=f"This is a comment from {borrower.name}",
            date=datetime.now(),
            user_id=borrower.id,
            loan_application_id=i,
        )
        db.session.add(comment)

    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        seed_data()
        print("Data seeded successfully")
