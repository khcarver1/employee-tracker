

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