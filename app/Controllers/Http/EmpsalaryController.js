'use strict';
const dataBase = use('Database');
const EmpSalary = use('App/Models/salaries');
const Employee = use('App/Models/Employee');

//Message
const notFound = {data: "empty", message: 'Not Found', status: false};

class EmpsalaryController {

  //get all emp sal

  async Showid ({request,response}) {
      var {emp_no} = request.only('emp_no');
      var employee = await EmpSalary.findBy('emp_no',emp_no);
       if (employee) {
          var user = await Employee.findBy('emp_no', emp_no);
          const empSalary =  await user.salaries().fetch();
          return response.status(200).json({
            data: empSalary,
            message: 'get the record',
            status: true
          });
      }
  }
}

module.exports = EmpsalaryController;
