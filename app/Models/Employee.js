'use strict';

const Model = use('Model');

//const EmpSalary = use('App/Models/Salaries');

class Employee extends Model {
  //Add employee
  static get AddNewEmployee() {
    return {
      emp_no: 'required|unique:employees',
      firstname: 'required|min:5|max:20',
      gender: 'in:m,f|required',
      hiredate: 'date_format:YYYY-MM-DD|required'
    }
  }

  //Update Rules

  static get UpdateEmployee() {
    return {
      firstname: 'required|min:5|max:20',
      gender: 'in:m,f|required',
      hiredate: 'date_format:YYYY-MM-DD|required'
    }
  }

  //Add employee- error

  static get AddEmployeeError() {
    return {
      'emp_no.required': 'Employee no required',
      'emp_no.unique': 'Already this Employee no registered',
      'firstname.required': 'firstname is required',
      'firstname.min': 'firstname should be min 5 characters',
      'firstname.max': 'firstname not more than max 20 characters',
      'hiredate.date_format': 'date format should be like this:YYYY-MM-DD',
      'hiredate.required': 'hiredate should be need',
      'gender.required': 'gender should be mention',
      'gender.in': 'gender m,f format only'
    }
  }

  static get ValidAuth() {
    return {
      status: false,
      message: "Required token",
      data: "JWT token need in header "
    }
  }

  salaries() {
    return this.hasOne('App/Models/Salaries', 'emp_no', 'emp_no');
  }
  emp_titles() {
    return this.hasMany('App/Models/EmpTitle', 'emp_no', 'emp_no')
  }

}

module.exports = Employee;
