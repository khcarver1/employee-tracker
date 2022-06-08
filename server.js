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
    db.query(
        `SELECT * FROM employee
        LEFT JOIN role
        ON employee.role.id = role.id`,
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
const addEmp = () => {
    db.query(
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            let roleArr = [];
            results.forEach(item => {
                roleArr.push(item.title)
            })

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
                        choices: roleArr
                    },
                    {
                        type: 'input',
                        name: 'mngt_pick',
                        message: 'What will their manager ID be?',
                    }
                ])
                .then((data) => {
                    let role_id;
                    for (i = 0; i < roleArr.length; i++) {
                        if (data.role_pick === roleArr[i]) {
                            role_id = i + 4
                        }
                    }
                });
            let manager_id;
            if (!data.mngt_pick) {
                manager_id = null;
            }
            db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`,
                [data.first_name, data.last_name, role_id, manager_id],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.log('Employee succesfully added!');
                    questions();
                }
            )
 
        })
}
const upEmp = () => {
        db.query(
            `SELECT * FROM role`,
            function (err, results, fields) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                let roleArr = [];
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
                        )
                    });
            })
    }
