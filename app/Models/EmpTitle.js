'use strict'

const Model = use('Model')

class EmpTitle extends Model {

  static get createdAtColumn() {
    return null
  }
  static get updatedAtColumn() {
    return null
  }
  static get AddEmpTitle() {
    return {
      title: 'required'
    }
  }
  static get AddEmpTitleError() {
    return {
      'title.required': 'title field required'
    }
  }
  static get TitleUpdate() {
    return {
      title: 'required',
      emp_no: 'required',
      from_date: 'date_format:YYYY-MM-DD|required',
      to_date: 'date_format:YYYY-MM-DD|required'
    }
  }
  static get UpdateMessage() {
    return {
      'title.required': 'title field required',
      'emp_no.required': 'Employee no required',
      'from_date.date_format': 'date format should be like this:YYYY-MM-DD',
      'from_date.required': 'from_date should be need',
      'to_date.date_format': 'date format should be like this:YYYY-MM-DD',
      'to_date.required': 'to_date should be need',
    }
  }

}

module.exports = EmpTitle
