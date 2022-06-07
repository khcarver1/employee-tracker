const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '73bug4Lennon123!',
        database: 'employees_db'
    });

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

// View department
function viewDep() {
    db.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            questions();
        }
    )
}

function addDep() {
    inquirer
        .prompt({
            type: 'text',
            name: 'dep_name',
            message: 'Please enter the name of the department you would like to add: '
        })
        .then((data) => {
            db.query(
                `INSERT INTO department (name)
                VALUES(?)`,
                [data.dep_name],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log('Added department!');
                    questions();
                }
            )
        })
}
const viewAllEmp = () => {

    // connect to db
    db.query(
        // Manipulate tables to view all employees
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, manager.first_name AS manager,
            department.name AS department 
            FROM employee
            LEFT JOIN role
            ON employee.role_id = role.id
            LEFT JOIN department
            ON role.department_id = department.id
            LEFT JOIN manager
            ON employee.manager_id = manager.id`,
        // Call back function to decide what to do with data
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Show the results as a table to the user
            console.table(results);

            // Re-prompt the user
            questions();
        }
    );
};
// Add a new employee
const addEmp = () => {

    // Connect to DB
    db.query(
        // Select all roles from table for future ref
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Create empty array for storing info
            let roleArr = [];

            // for each item in the results array, push the name of the roles to the roles array
            results.forEach(item => {
                roleArr.push(item.title)
            })
            // Connect to db again 
            // db.query(
            //     // Select all managers from managers table for future ref
            //     `SELECT * FROM manager`,
            //     function (err, results, fields) {
            //         if (err) {
            //             console.log(err.message);
            //             return;
            //         }

            //         // Create empty array for managers
            //         let manArr = [];

            //         // For each item in results array, push the name of the manager to the manager array
            //         results.forEach(item => {
            //             manArr.push(item.first_name)
            //         });

                    // Prompt the user
                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'first_name',
                                message: 'What is you employees first name?'
                            },
                            {
                                type: 'text',
                                name: 'last_name',
                                message: 'What is your employees last name?'
                            },
                            {
                                type: 'list',
                                name: 'role_pick',
                                message: 'What will you employees role?',
                                // use the names from the roles array to get the roles, this will allow us to add new roles in the future
                                choices: roleArr
                            },
                            {
                                type: 'input',
                                name: 'mngt_pick',
                                message: 'What will their manager ID be?',
                                // If the user confirms the emp is a manager, then do not run this prompt
                                // when: ({ mngt_confirm }) => {
                                //     if (!mngt_confirm) {
                                //         return true;
                                //     } else {
                                //         return false;
                                //     }
                                // },
                                // // Choices will be the names from the manager array
                                // choices: manArr
                                
                            }
                        ])
                        .then((data) => {
                            // Create a loop of the role arr in order to compare the users answer to the position it is in in the array,
                            // this will provide us with a number that can be used as an id for the role_id section of our table
                            let role_id;
                            for (i = 0; i < roleArr.length; i++) {
                                if (data.role_pick === roleArr[i]) {
                                    role_id = i + 4
                                }
                            }

                            // // if statement that will decide weather or not based on users input if the employee is a manager or not 
                            // let manager_confirm;
                            // if (data.mngt_confirm === true) {
                            //     manager_confirm = 1;
                            // } else {
                            //     manager_confirm = 0
                            // }

                            let manager_id;

                            // // if the mngt_pick prompt was not run and returns nothing set the manager_id to null
                            if (!data.mngt_pick) {
                                manager_id = null;
                                // else Create a loop of the manager arr in order to compare the users answer to the position it is in in the array,
                                // this will provide us with a number that can be used as an id for the manager_id section of our table
                            } 
                            // else {
                            //     for (i = 0; i < manArr.length; i++) {
                            //         if (data.mngt_pick === manArr[i]) {
                            //             manager_id = i + 1
                            //         }
                            //     }
                            // }
                            // Connect to db again
                            db.query(
                                // Insert values from user into db, uses place holders to prevent SQL Injection attack
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee succesfully added!');
                                    // Reset to main screen
                                    questions();
                                }
                            );
                        });
                
            
        }
    );
};

const upEmp = () => {
    // Select all roles from table for future ref
    db.query(
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Create empty array for storing info
            let roleArr = [];

            // for each item in the results array, push the name of the roles to the role array
            results.forEach(item => {
                roleArr.push(item.title)
            })
            db.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }

                    let nameArr = [];
                    results.forEach(item => {
                        nameArr.push(item.first_name);
                        nameArr.push(item.last_name);
                    })
                    let combinedNameArr = [];
                    for (let i = 0; i < nameArr.length; i += 2) {
                        if (!nameArr[i + 1])
                            break
                        combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`)
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'name_select',
                                message: 'Please select an employee you would like to update',
                                choices: combinedNameArr
                            },
                            {
                                type: 'list',
                                name: 'role_select',
                                message: 'Please select a role you would like your employee to change to:',
                                choices: roleArr
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (let i = 0; i < roleArr.length; i++) {
                                if (data.role_select === roleArr[i]) {
                                    role_id = i + 1;
                                }
                            };
                            let selectedNameArr = data.name_select.split(" ");
                            let last_name = selectedNameArr.pop();
                            let first_name = selectedNameArr[0];

                            db.query(
                                `UPDATE employee 
                                            SET role_id = ?
                                            WHERE first_name = ? AND last_name = ?`,
                                [role_id, first_name, last_name],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee updated!');
                                    questions();
                                }
                            );
                        });
                }
            );

        }
    );
};
const viewRoles = () => {
    db.query(
        `SELECT role.id, role.title, role.salary, department.name
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id `,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            questions();
        }
    );
};

const addRole = () => {
    db.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

            let depArr = [];
            results.forEach(item => {
                depArr.push(item.name)
            })

            inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'role_title',
                        message: 'Please enter the name of the role you would like to add: '
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Please enter the salary of this role. Note: Please do not use commas or periods'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please select the department you role will be a part of: ',
                        choices: depArr
                    }
                ])
                .then((data) => {
                    let department_id;

                    for (let i = 0; i < depArr.length; i++) {
                        if (depArr[i] === data.department) {
                            department_id = i + 1;
                        };
                    };

                    db.query(
                        `INSERT INTO role (title, salary, department_id)
                            VALUES(?,?,?)`,
                        [data.role_title, data.salary, department_id],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.log('Role added!')
                            questions();
                        }
                    );
                });
        }
    );
};