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
  console.log("--Employee Tracker--");
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
          "4. Update Employee Role and Manager?",
          "5. View All Employees?",
          "6. View All Roles?",
          "7. View all Departments?",
          "8. View all Employees By Department?",
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

        case "4. Update Employee Role and Manager?":
          updateEmployee();
          break;

        case "5. View All Employees?":
          viewAllEmployees();
          break;

        case "6. View All Roles?":
          viewRoles();
          break;

        case "7. View all Departments?":
          viewAllDepartments();
          break;

        case "8. View all Employees By Department?":
          viewAllEmpDepartments();
          break;
      }
    });
}
//Add Employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "Firstname",
        type: "input",
        message: "Enter their first name? ",
      },
      {
        name: "Lastname",
        type: "input",
        message: "Enter their last name? ",
      },
      {
        name: "Role",
        type: "list",
        message: "What is their role? ",
        choices: selectRole(),
      },
      {
        name: "Manager",
        type: "list",
        message: "What's their managers name?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      //gets roleId from array generated in selectRole() function
      var roleId = roleArr.indexOf(val.Role) + 1;
      //gets managerID from array generated in selectManager() function 
      var managerId = managersArr.indexOf(val.Manager);
      var managerIndex = managersIdArr[managerId];
      if (val.Manager === "None") {
        db.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, Null);",
          [val.Firstname, val.Lastname, roleId],
          function (err) {
            if (err) throw err;
            console.table(val);
            startPrompt();
          }
        );
      } else {
        db.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?);",
          [val.Firstname, val.Lastname, roleId, managerIndex],
          function (err) {
            if (err) throw err;
            console.table(val);
            startPrompt();
          }
        );
      }
    });
}
//selectRole Queries Role Title for Add Employee Prompt
var roleArr = [];
function selectRole() {
  if (roleArr.length > 0) {
    roleArr = [];
  }
  db.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}
//selectManager Queries Managers for Add Employee and Update Employee Prompt
//
var managersArr = [];
//array to get id for managers
var managersIdArr = [];
function selectManager() {
  if (managersArr.length > 0) {
    managersArr = [];
  }
  if (managersIdArr.length > 0) {
    managersIdArr = [];
  }
  db.query(
    "SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name + " " + res[i].last_name);
        managersIdArr.push(res[i].id);
      }
      managersArr.push("None");
    }
  );
  return managersIdArr, managersArr;
};

//Add Employee Role
function addRole() {
  inquirer
    .prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the new Role?",
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary?",
      },
      {
        name: "Department",
        type: "list",
        message: "What is their Department? ",
        choices: selectDepartment(),
      },
    ])
    .then(function (val) {
      var deptId = deptArr.indexOf(val.Department) + 1;
      db.query(
        "INSERT INTO role (title, salary, department_id) values (?, ?, ?);",
        [val.Title, val.Salary, deptId],
        function (err) {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
}
//selectDepartment function for addRole function
var deptArr = [];
function selectDepartment() {
  if (deptArr.length > 0) {
    deptArr = [];
  }
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
        message: "What is the new Department?",
      },
    ])
    .then(function (val) {
      db.query(
        "INSERT INTO department (name) values (?)",
        [val.name],
        function (err) {
          if (err) throw err;
          console.table(val);
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
        name: "Update",
        type: "input",
        message: "Why are you updating? ",
      },
      {
        name: "Name",
        type: "list",
        message: "What is the employee's name? ",
        choices: Name(),
      },
      {
        name: "Role",
        type: "list",
        message: "What is the employee's new title? ",
        choices: selectRole(),
      },
      {
        name: "Manager",
        type: "list",
        message: "What's their managers name?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      var roleId = roleArr.indexOf(val.Role) + 1;
      var nameId = nameArr.indexOf(val.Name) + 1;
      //gets managerID from array generated in selectManager() function 
      var managerId = managersArr.indexOf(val.Manager);
      var managerIndex = managersIdArr[managerId];
      if (val.Manager === "None") {
        db.query(
          "UPDATE employee SET role_id = ?, manager_id = null WHERE id = ?;",
          [roleId, nameId],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
          }
        );
      } else {
        db.query(
          "UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;",
          [roleId, managerIndex, nameId],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
          }
        );
      }
    });
}
//function to get a list of all employee names
var nameArr = [];
function Name() {
  if (nameArr.length > 0) {
    nameArr = [];
  }
  db.query(
    "SELECT * FROM employee",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        nameArr.push(res[i].first_name + " " + res[i].last_name);
      }
    });
  return nameArr;
}
//View All Employees
function viewAllEmployees() {
  db.query(
    "SELECT employee.first_name AS First_name, employee.last_name AS Last_name, role.title AS Job_title, role.salary AS Salary, department.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}
//View All Roles
function viewRoles() {
  db.query(
    "SELECT role.id AS Job_id, role.title AS Job_title, role.salary AS Salary, department.name AS Department FROM role INNER JOIN department on role.department_id=department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};
//View All Departments
function viewAllDepartments() {
  db.query(
    "SELECT id AS Dept_id, name AS Dept_name FROM department;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};
//View All Employees By Departments
function viewAllEmpDepartments() {
  db.query(
    "SELECT employee.first_name AS First_name, employee.last_name AS Last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};
