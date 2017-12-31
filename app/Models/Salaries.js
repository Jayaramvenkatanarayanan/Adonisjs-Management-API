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
}

module.exports = Salaries;
