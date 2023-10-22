INSERT INTO department (dept_name)
VALUES
    ("Engineering"),
    ("Sales"),
    ("Onboarding"),
    ("Customer Support"),
    ("Finance");

-- Insert seed data into the 'roles' table
INSERT INTO roles (id, title, salary, dept_id)
VALUES
    (1, "Chief Technical Officer", 200000, 1),
    (2, "Chief Revenue Officer", 210000, 2),
    (3, "Chief Operating Officer", 170000, 3),
    (4, "Chief Client Experience", 145000, 4),
    (5, "Chief Financial Officer", 200000, 5);

-- Insert seed data into the 'employees' table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Justin", "Schultz", 1, 100),
    ("Jack", "Sanogo", 2, 200),
    ("Arlin", "Lemmon", 3, 300),
    ("Juanda", "Pool", 4, 400),
    ("Jaime", "George", 5, 500);
