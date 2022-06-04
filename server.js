const inquirer = require('inquirer');
const fs = require('fs');

const questions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View Depts', 'View rols', 'View employees', 'Add dept', 'Add employee', 'Add role', 'Update employee role', 'I am finished']
        }
    ]).then((data) => {
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
            case 'I am finished':
                break;
        }
    })
};
questions();
console.log(data['choices']);


module.exports = { questions };
const { viewAllEmp, addEmp, upEmp } = require('./lib/employee.js');
const { viewDep, addDep } = require('./lib/dept.js');
const { viewRoles, addRole } = require('./lib/role.js');