const inquirer = require('inquirer');
const fs = require('fs');
const { viewAllEmp, addEmp, upEmp } = require('./lib/employee');
const { viewDep, addDep } = require('./lib/dept');
const { viewRoles, addRole } = require('./lib/role');

questions = () => {
    inquirer
        .prompt({
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Employee', 'Add Role', 'Update Employee Role', 'I am Finished']
    }).then((data) => {
        switch (data.choices) {
            case 'View Departments':
                viewDep();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'View Employees':
                viewAllEmp();
                break;
            case 'Add Department':
                addDep();
                break;
            case 'Add Employee':
                addEmp();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                upEmp();
                break;
            case 'I am Finished':
                break;
        }
        console.log(data.choices + ' chosen!!!');
    })
};
questions();