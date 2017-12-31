'use strict';

/**
 * Model and dependency and rules
 */
const dataBase = use('Database');
const Employee = use('App/Models/Employee');
const Validator = use('Validator');
const User = use('App/Models/User');
const EmpSalary = use('App/Models/salaries');

//Message
const notFound = {data: "empty", message: 'Not Found', status: false};


class EmployeeController {

  //get all employee
  async Showall({response}) {
    var employee = await dataBase.table('employees').count();
    var total = employee[0]['count(*)'];
    if (total != 0) {
      var getAllEmp = await Employee.all();
      return response.status(200).json({
        data: getAllEmp,
        message: 'get the record',
        status: true
      });
    }
    return response.status(404).json(notFound);

  }

  async Store({request, response}) {

    const empInput = request.only(['emp_no', 'firstname', 'lastname', 'gender', 'hiredate']);
    const empSalInput = request.only(['salary', 'from_date', 'to_date']);
    const empValidation = await Validator.validate(empInput, Employee.AddNewEmployee, Employee.AddEmployeeError);
    if (empValidation.fails()) {
      return response.status(400).json({
        data: empValidation._errorMessages[0].message,
        message: 'Employee registration fail',
        status: false
      });
    }
    var emp = new Employee();
    emp.emp_no = empInput.emp_no;
    emp.firstname = empInput.firstname;
    emp.lastname = empInput.lastname;
    emp.gender = empInput.gender;
    emp.hiredate = empInput.hiredate;
    await emp.save();
    var employee = await Employee.findBy('emp_no', empInput.emp_no);
    console.log(employee);
    const empSal = await employee.salaries().create({
      "salary": empSalInput.salary,
      "from_date": empSalInput.from_date,
      "to_date": empSalInput.to_date 
    });
    console.log(empSal);
    return response.status(201).json({
      message: "Employee save successful",
      status: true
    });


  }


  //get by id
  async Showid({request, response}) {

    var {emp_no} = request.only('emp_no');
    var employeeId = await dataBase.table('employees').where('emp_no', '=', emp_no);
    if (employeeId.length != 0) {
      return response.json({
        data: employeeId,
        message: 'get the record',
        status: true
      });
    }
    return response.status(404).json(notFound);
  }

  //update
  /**
   * Update
   */

  async Empupdate({request, response}) {
    var {emp_no} = request.only('emp_no');
    var employeeUpdate = await dataBase.table('employees').where('emp_no', '=', emp_no);
    if (employeeUpdate.length == 0) {
      return response.status(404).json({
        data: 'update fail',
        message: 'Id does not match',
        status: false
      })
    }
    const empInput = request.only(['emp_no', 'firstname', 'lastname', 'gender', 'hiredate']);
    const empValidation = await Validator.validate(empInput, Employee.UpdateEmployee, Employee.AddEmployeeError);
    console.log(empValidation);
    if (empValidation.fails()) {
      return response.status(400).json({
        data: empValidation._errorMessages[0].message,
        message: 'Employee Update  fail',
        status: false
      });
    }
    await dataBase.table('employees').where('emp_no', '=', emp_no).update({'firstname': empInput.firstname});
    return response.status(200).json({
      message: 'user Update successfull',
      status: true
    });
  }

  /**
   * delete
   */

  async Remove({request, response}) {
    var {emp_no} = request.only('emp_no');
    var employeeUpdate = await dataBase.table('employees').where('emp_no', '=', emp_no);
    if (!employeeUpdate) {
      return response.status(404).json({
        data: 'no data found',
        message: 'Id does not match /  no records found',
        status: false
      })
    }
    await dataBase.table('employees').where('emp_no', '=', emp_no).delete();
    return response.status(204).json({message: 'delete successfully', status: true})
  }

  /**
   * belongs to
   */
  async empsal({request, response}) {
    var {emp_no} = request.only('emp_no');
    const outPut = {};
    var user = await EmpSalary.findBy('emp_no', emp_no);
    if (!user) {
      return response.status(404).json({
        data: 'no data found',
        message: 'Id does not match /  no records found',
        status: false
      });
    }
    const empSalary = await user.Empsal().fetch();
    outPut.empSalary = user;
    outPut.empDetails = empSalary;
    return response.status(200).json({
      data: outPut,
      message: 'get the record',
      status: true
    });
  }
}


module.exports = EmployeeController;
