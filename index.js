const hide = require('hide-secrets');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    }
);

inquirer
    .prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'start',
            choices: [
                'View all Employees',
                'View all Departments',
                'View all Roles',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Update Employee Role'
            ]

        })