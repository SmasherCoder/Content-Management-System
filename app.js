const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  startPrompt();
});

function startPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "1. Add Employee?",
          "2. Add Role?",
          "3. Add Department?",
          "4. Update Employee?",
          "5. View All Employees?",
          "6. View All Employee's By Roles?",
          "7. View all Emplyees By Departments?",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "1. Add Employee?":
          addEmployee();
          break;

        case "2. Add Role?":
          addRole();
          break;

        case "3. Add Department?":
          addDepartment();
          break;

        case "4. Update Employee?":
          updateEmployee();
          break;

        case "5. View All Employees?":
          viewAllEmployees();
          break;

        case "6. View All Employee's By Roles?":
          viewEmpRoles();
          break;

        case "7. View all Emplyees By Departments?":
          viewAllDepartments();
          break;
      }
    });
}
//Add Employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter their first name ",
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter their last name ",
      },
      {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "Whats their managers name?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      //gets roleId from array generated in selectRole() function
      var roleId = roleArr.indexOf(val.role) + 1;
      //gets managerID from array generated in selectManager() function 
      var managerId = managersArr.indexOf(val.choice) + 1;
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?);",
        [val.firstname, val.lastname, roleId, managerId],
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}
//Select Role Queries Role Title for Add Employee Prompt
var roleArr = [];
function selectRole() {

  db.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}
//Select Role Queries The Managers for Add Employee Prompt
var managersArr = [];
function selectManager() {

  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name);
      }
    }
  );
  return managersArr;
}
//Add Employee Role
function addRole() {
  inquirer
    .prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the roles Title?",
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary?",
      },
      {
        name: "Department",
        type: "list",
        message: "What is their department? ",
        choices: selectDepartment(),
      }
    ])
    .then(function (res) {
      var deptId = deptArr.indexOf(res.Department) + 1;
      db.query(
        "INSERT INTO role (title, salary, department_id) values (?, ?, ?);",
        [res.Title, res.Salary, deptId],
        function (err) {
          if (err) throw err;
          console.table(res);
          startPrompt();
        }
      );
    });
}
//selectDepartment function for addRole function
var deptArr = [];
function selectDepartment() {
  db.query(
    "SELECT * FROM department",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        deptArr.push(res[i].name);
      }
    });
  return deptArr;
}
//Add Department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
      },
    ])
    .then(function (res) {
      var query = db.query(
        "INSERT INTO department (name) values (?)",
        [res.name],
        function (err) {
          if (err) throw err;
          console.table(res);
          startPrompt();
        }
      );
    });
}
//Update Employee
function updateEmployee() {
  inquirer
    .prompt([
      {
        name: "update",
        type: "input",
        message: "Why are you updating? ",
      },
      {
        name: "firstName",
        type: "list",
        message: "What is the employee's first name? ",
        choices: firstName(),
      },
      {
        name: "lastName",
        type: "list",
        message: "What is the employee's name? ",
        choices: lastName(),
      },
      {
        name: "role",
        type: "list",
        message: "What is the employees new title? ",
        choices: selectRole(),
      },
    ])
    .then(function (val) {
      var roleId = roleArr.indexOf(val.role) + 1;
      db.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
        [roleId, val.firstname, val.lastName],
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}
var firstnameArr = [];
function firstName() {
  db.query(
    "SELECT * FROM employee",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        firstnameArr.push(res[i].first_name);
      }
    });
  return firstnameArr;
}
var lastnameArr = [];
function lastName() {
  db.query(
    "SELECT * FROM employee",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        lastnameArr.push(res[i].last_name);
      }
    }
  );
  return lastnameArr;
}

//============= View All Employees ==========================//
function viewAllEmployees() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//============= View All Roles ==========================//
function viewEmpRoles() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//============= View All Employees By Departments ==========================//
function viewAllDepartments() {
  db.query(
    "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
