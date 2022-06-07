USE employees_db;

INSERT INTO department (name) VALUES ('Human Resources');

INSERT INTO role (title,salary,department_id)
VALUES
('loan officer',77000,1),
('bank manager',150000,1),
('teller',38000,1);
