'use strict'

const Model = use('Model');

class Salaries extends Model {

  Empsal () {
    return this.belongsTo('App/Models/Employee','emp_no','emp_no')
  }
  static get createdAtColumn () {
    return null
  }
  static get updatedAtColumn () {
    return null
  }
  static get Addempsal(){
    return {
      salary: 'required',
      from_date: 'date_format:YYYY-MM-DD|required',
      to_date: 'date_format:YYYY-MM-DD|required'
    }
  }
  static get AddEmpSalError(){
    return{
      'from_date.date_format': 'date format should be like this:YYYY-MM-DD',
      'salary.required': 'salary field required',
      'from_date.required': 'from_date should be need',
      'to_date.date_format': 'date format should be like this:YYYY-MM-DD',
      'to_date.required': 'to_date should be need',
    }
  }
}

module.exports = Salaries;
