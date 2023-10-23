const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const { exec } = require('child_process');

// Create a database connection using variables
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
    startInquirer(); // Start the main inquirer menu
});

// Handle database connection errors
db.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Main menu function
function startInquirer() {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'start',
            choices: [
                'View all Departments',
                'View all Employees',
                'View all Roles',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Quit'
            ]
        })
        // Switch stament that calls different functions depending on what the user chooses
        .then((answer) => {
            switch (answer.start) {
                case 'View all Departments':
                    viewAllDepartments();
                    break;
                case 'View all Employees':
                    viewAllEmployee();
                    break;
                case 'View all Roles':
                    viewAllRoles();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Quit':
                    runQuitScripts();
                    break;
            }
        });
}

// Function to view all departments
function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

// Function that grabs elements from the employee table and joins them on the roles table to return a custom query from the database
function viewAllEmployee() {
    const query =
        `SELECT
            employees.id AS employee_id,
            employees.first_name,
            employees.last_name,
            roles.title AS job_title,
            roles.salary
        FROM
            employees
        JOIN
            roles
        ON
            employees.role_id = roles.id;
        `;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

// Function that grabs data from the roles table and combines it with the department table to create a custom query.
function viewAllRoles() {
    const query =
        `SELECT
            roles.id AS role_id,
            roles.title AS job_title,
            department.dept_name AS department,
            roles.salary
        FROM
            roles
        JOIN
            department
        ON
            roles.dept_id = department.id;`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

// Function to add a department
function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'Enter the name of the department:',
            name: 'dept_name',
        })
        .then((answer) => {
            const query = 'INSERT INTO department (dept_name) VALUES (?)';
            db.query(query, [answer.dept_name], (error, res) => {
                if (error) {
                    console.error('Error adding department:', error);
                } else {
                    console.log(`Added department: ${answer.dept_name}`);
                    startInquirer();
                }
            });
        });
}

// Function to add a role
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter the title of the new role:",
                name: 'title',
            },
            {
                type: 'input',
                message: "Enter the salary for the new role:",
                name: 'salary',
            },
            {
                type: 'input',
                message: "Enter the department ID for the new role:",
                name: 'dept_id',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)';
            const values = [answers.title, answers.salary, answers.dept_id];

            db.query(query, values, (error, result) => {
                if (error) {
                    console.error('Error adding role:', error);
                } else {
                    console.log(`Role added successfully! Role ID: ${result.insertId}`);
                    startInquirer();
                }
            });
        });
}

// Function to add an employee
function addEmployee() {
    // Prompt for employee information
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter the employee's first name:",
                name: 'first_name',
            },
            {
                type: 'input',
                message: "Enter the employee's last name:",
                name: 'last_name',
            },
            {
                type: 'input',
                message: "Enter the employee's role ID:",
                name: 'role_id',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)';
            const values = [answers.first_name, answers.last_name, answers.role_id];

            db.query(query, values, (error, result) => {
                if (error) {
                    console.error('Error adding employee:', error);
                } else {
                    console.log(`Employee added successfully! Employee ID: ${result.insertId}`);
                    startInquirer();
                }
            });
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter the employee's ID to update:",
                name: 'employee_id',
            },
            {
                type: 'input',
                message: "Enter the new role ID for the employee:",
                name: 'new_role_id',
            },
        ])
        .then((answers) => {
            const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
            const values = [answers.new_role_id, answers.employee_id];

            db.query(query, values, (error, result) => {
                if (error) {
                    console.error('Error updating employee:', error);
                } else {
                    if (result.affectedRows === 0) {
                        console.log('Employee not found or role not updated.');
                    } else {
                        console.log('Employee role updated successfully!');
                    }
                    startInquirer();
                }
            });
        });
}

// Function to run the quit scripts
function runQuitScripts() {
    console.log('Running Quit scripts...');

    // Run schema.sql
    const schemaCommand = `mysql -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ./db/schema.sql`;

    const schemaProcess = exec(schemaCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing schema.sql:', error);
        } else {
            console.log('schema.sql executed successfully');

            // Run seeds.sql
            const seedsCommand = `mysql -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ./db/seeds.sql`;

            const seedsProcess = exec(seedsCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error executing seeds.sql:', error);
                } else {
                    console.log('seeds.sql executed successfully');
                }
                console.log('Goodbye!');
                process.exit(0);
            });
        }
    });
}

