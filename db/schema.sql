DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE deparment(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    deparment_id INT,
    INDEX deparment_id2 (deparment_id),
    CONSTRAINT fk_deparment FOREIGN KEY(deparment_id) REFERENCES deparment(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    INDEX role_id2 (role_id),
    CONSTRAINT fk_role_id FOREIGN KEY(role_id) REFERENCES role(id),
    manager_id INT,
    INDEX manager_id2 (manager_id),
    CONSTRAINT fk_manager_id2 FOREIGN KEY(manager_id) REFERENCES employee(id)
)