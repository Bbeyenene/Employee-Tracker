-- create database --
DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- DEPARTMENT TABLE ----
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);
-- DEPARTMENTS TABLE ----
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- EMPLOYEE'S ROLE TABLE ----
CREATE TABLE employeeT (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
);

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Marketing");

INSERT INTO department (name)
VALUE ("Finance");

INSERT INTO department (name)
VALUE ("Management");

INSERT INTO department (name)
VALUE ("Human Resource");

INSERT INTO department (name)
VALUE ("IT");
------------------------------------------------
-- EMPLOYEE ROLE SEEDS -------
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 5);

INSERT INTO role (title, salary, department_id)
VALUE ("Technical Program Manager", 150000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 5);

INSERT INTO role (title, salary, department_id)
VALUE ("Accountant manager", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ("Senior Software Engineer", 1800000, 5);

INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 120000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ("Recruiter", 190000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("Mary", "William", null, 2);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("Mary", "William", null, 2);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("John","Richard",null,3);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("Denis", "Taylor", 1, 4);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("Sarah", "Donald", 4, 5);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("Elizabeth", "Baker", 1, 6);

INSERT INTO employeeT (first_name, last_name, manager_id, role_id)
VALUE ("David", "Mark", 2, 7);

-- SELECTING all from the three tables 
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;