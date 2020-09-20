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
    //startPrompt();
 });
