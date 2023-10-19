const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to the database');

    startInquirer();
});

db.on('error', (err) => {
    console.error('Database connection error:', err);
});

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
                'Add Employee',
                'Add Department',
                'Add Role',
                'Update Employee Role'
            ]
        })
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
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
            }
        });
}

function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

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

function addEmployee() {
    const query = `SELECT * FROM department`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

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
                if (error) throw error;
                console.log(`Added department: ${answer.dept_name}`);
                startInquirer();
            });
        });
}

function addRole() {
    const query = `SELECT * FROM department`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

function updateEmployeeRole() {
    const query = `SELECT * FROM department`;
    db.query(query, (error, res) => {
        if (error) throw error;
        console.table(res);
        startInquirer();
    });
}

process.on('exit', () => {
    db.end();
});