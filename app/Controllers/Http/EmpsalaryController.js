'use strict';
const dataBase = use('Database');
const EmpSalary = use('App/Models/salaries');
const Employee = use('App/Models/Employee');
const Validator = use('Validator');

//Message
const notFound = {data: "empty", message: 'Not Found', status: false};

class EmpsalaryController {

    //get all emp sal

    async Showid({request, response}) {
        var {emp_no} = request.only('emp_no');
        var employee = await EmpSalary.findBy('emp_no', emp_no);
        if (employee) {
            var user = await Employee.findBy('emp_no', emp_no);
            const empSalary = await user.salaries().fetch();
            return response.status(200).json({
                data: empSalary,
                message: 'get the record',
                status: true
            });

        }
        return response.status(404).json(notFound);
    }

    //update

    async Salupdate({request, response}) {
        var empInput = request.only(['emp_no', 'salary', 'to_date']);
        var empSal = await EmpSalary.findBy('emp_no', empInput.emp_no);
        if (empSal != null) {
            await dataBase.table('salaries').where('emp_no', empInput.emp_no).update({'salary': empInput.salary}, {'to_date': empInput.to_date});
            return response.status(200).json({
                message: 'emp salary Update successfull',
                status: true
            });
        }
        return response.status(404).json(notFound);
    }


}

module.exports = EmpsalaryController;
