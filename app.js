//Dependencies
const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

//creatiog a connection btween database and localhost using port 3306
const connection = mysql.createConnection({
    host: "Localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_trackerDB"
  });


//calling a fuction for the connection using a specific threadId to run startProgram function
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id: " + connection.threadId)
    startPrompt();
 });

 //function startPrompt(){inquirer.prompt().then(answer => {..code..});
function startPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees?",
        "View All Employee's By Roles?",
        "View all Emplyees By Deparments", 
        "Add Employee?",
        "Update Employee?",
        "Add Role?",
        "Add Department?",
        "Lay Off Employee",
        "Employee Badget?"
      ]
    }
  ]).then(answer => {
    //call a particular functions based on the answer selected from the choice above
    switch (answer.choice) {
      case "View All Employees?":
        viewAllEmployees();
        break;

      case "View All Employee's By Roles?":
        viewAllRoles();
        break;

      case "View all Emplyees By Deparments":
        viewAllDepartments();
        break;

      case "Add Employee?":
        addEmployee();
        break;

      case "Update Employee?":
        updateEmployeeRole();
        break;

      case "Add Role?":
        addRole();
        break;  

      case "Add Department?":
        addDepartment();
        break;

      case "Lay Off Employee":
        fireEmployee();

      case "Employee Badget?":
        employeeBuget();

    }
  })
}

//case 1. View All Employees?
function viewAllEmployees() {
  var query = "SELECT employeeT.id, employeeT.first_name, employeeT.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employeeT INNER JOIN  role on role.id = employeeT.role_id INNER JOIN department on department.id = role.department_id left join employeeT e on employeeT.manager_id = e.id;"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
}