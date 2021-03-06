//Dependencies
const inquirer = require("inquirer")
const mysql = require("mysql")
const myTable = require('console.table');

//creatiog a connection btween database and localhost using port 3306
const connection = mysql.createConnection({
    host: "Localhost",
    port: 3306,
    user: "root",
    password: "Nathan@2015",
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
        "Employee Badget?",
        "Exit"
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
        break;
      case "Employee Badget?":
        employeeBuget();
        break;
      case "Exit":
        exitTracker();

    }
  })
}

//case 1. View All Employees?
function viewAllEmployees() {
  var query = "SELECT employeeT.id, employeeT.first_name, employeeT.last_name, role.title, role.salary, department.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employeeT INNER JOIN  role on role.id = employeeT.role_id INNER JOIN department on department.id = role.department_id left join employeeT e on employeeT.manager_id = e.id;"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log('___________________________________________________________________________________________')
    console.table(res);
    console.log('___________________________________________________________________________________________')
    startPrompt();
  })
}

//case 2. View All Employee's By Roles?
function viewAllRoles() {
  var query = "SELECT employeeT.first_name, employeeT.last_name, role.title AS Title FROM employeeT JOIN role ON employeeT.role_id = role.id;";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log('________________________________________________')
    console.table(res);
    console.log('________________________________________________')
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

//case 5. Update employee
function updateEmployeeRole() {
  var query1 = (
    "SELECT e.first_name, e.last_name, e.id," + 
    "CONCAT(e.first_name, ' ', e.last_name) AS full_Name " + 
    "FROM employeeT AS e"
  );
  connection.query(query1, function (err, resN) {
    if (err) throw err;
    // collect all the response full name into an array to be used by as achoice list for the prompt
    var employeeNaneArr = [];
    for (var i = 0; i < resN.length; i++) {
      employeeNaneArr.push(resN[i].full_Name);
    }
    inquirer.prompt(
      [{
        name: "employeeName",
        type: "list",
        message: "Name of employee to update?",
        choices: employeeNaneArr
      }]
    ).then(function (resName) {
      // if a name to update is selected then; 
      //collect role titles from the query to be used as an araray choices for role prompt
      connection.query("SELECT r.title, r.id FROM role AS r", function (err, resR) {
        if (err) throw err;
        var roleTitlesArr = [];
        for (var i = 0; i < resR.length; i++) {
            roleTitlesArr.push(resR[i].title);
        }
        inquirer.prompt(
          [{
            name: "titleRole",
            type: "list",
            message: "Select the new role!",
            choices: roleTitlesArr
          }]
      ).then(function (resRole) {
        //for each response  asign the preupdated employee id to that particular person updated.
        resN.forEach(person => {
          if (resName.employeeName === person.full_Name) {
              employeeID = person.id;
          }
        });
        var roleID = 0;
        resR.forEach(position => {
            if (position.title === resRole.titleRole) {
                roleID = position.id;
            }
        })
        connection.query("UPDATE employeeT SET role_id=(?) WHERE id=(?)", [roleID, employeeID], function (err3, res3) {
            if (err3) throw err3;
            console.log(`${resName.employeeName}'s role is updated to ${resRole.titleRole}.`);
            startPrompt();
          })
        })
      })
    })
  })
}

//case 6. add role
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the roles Title?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary?"
      } 
    ]).then(function(res) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: res.Title,
            salary: res.Salary,
          },
          function(err) {
            if (err) throw err
            console.table(res);
            startPrompt();
          }
        )
    });
  });
}

//case 7. adding department
function addDepartment() { 
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What Department would you like to add?"
    }
  ]).then(function(res) {
    connection.query("INSERT INTO department SET ? ",
      {
        name: res.name           
      },
      function(err) {
        if (err) throw err
        console.table(res);
        startPrompt();
      }
    )
  })
}

//case 8. deleting employee
function fireEmployee() {
  connection.query("SELECT * FROM employeeT", function (err, resId){
    var array = [];
    for (let index = 0; index < resId.length; index++) {
      const element = resId[index].first_name;
      array.push(element)
    }
    //console.log(array)
  inquirer.prompt(
    {
      name: "employeeName",
      type: "list",
      message: "Enter employee's id to be deleted?",
      choices: array
    }
  ).then(function (answer) {
    connection.query("DELETE FROM employeeT WHERE first_name= ?", answer.employeeName)
    console.log("\n" + answer.employeeName + " is successfuly fired!\n")
    
    startPrompt();
  })
})

}

//case 9. employee budget
function employeeBuget() {
  inquirer.prompt(
    {
      name: "budget",
      type: "confirm",
      message: "Do you want to know employee budget? (y/n)"
    }
  ).then(function (yes) {
    if (!yes.budget) return startPrompt();
    ; 
    console.log('\nCompany Employee and theier salary')
    console.log('----------------------------------')
    var query = "SELECT employeeT.id, employeeT.first_name, employeeT.last_name, role.salary FROM employeeT INNER JOIN  role on role.id = employeeT.role_id left join employeeT e on employeeT.manager_id = e.id;"
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      //get another connection
      var salaryArr= [];
      for (let index = 0; index < res.length; index++) {
        const element = res[index].salary;
        salaryArr.push(element);
      }
      var totalBuget = 0;
      for(var i = 0; i < salaryArr.length; i++) {
        totalBuget += parseInt(salaryArr[i]);
      }
      console.log('-------------------------------')
      console.log("Employees Total Budget = " + totalBuget)
      console.log('\n')
      startPrompt();
    })
  })
}

function exitTracker() {
  connection.end();
}