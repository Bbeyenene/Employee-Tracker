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

//case 2. View All Employee's By Roles?
function viewAllRoles() {
  var query = "SELECT employeeT.first_name, employeeT.last_name, role.title AS Title FROM employeeT JOIN role ON employeeT.role_id = role.id;";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
}

//cas 3. View all Emplyees By Deparments
function viewAllDepartments() {
  var query = "SELECT employeeT.first_name, employeeT.last_name, department.name AS Department FROM employeeT JOIN role ON employeeT.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employeeT.id;";
  connection.query(query, 
  function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
}

//case 4. Add Employee?
function addEmployee() { 
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role? ",
      choices: selectRole()
    },
    {
      name: "choice",
      type: "rawlist",
      message: "Whats their managers name?",
      choices: selectManager()
    }
  ]).then(function (val) {
    var roleId = selectRole().indexOf(val.role) + 1
    var managerId = selectManager().indexOf(val.choice) + 1
    var firstName = val.firstname;
    var lastName = val.lastname
    connection.query("INSERT INTO employeeT SET ?", 
      {
        first_name: firstName,
        last_name: lastName,
        manager_id: managerId,
        role_id: roleId
      }, function(err){
        if (err) throw err;
        console.table(val);
        startPrompt();
      })
  })
}

//case 4. choieces 1
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  })
  return roleArr;
}

//case 4. choice 2
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employeeT WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }
  })
  return managersArr;
}
