'use strict'

const Schema = use('Schema')

class DepartmentsSchema extends Schema {
  up () {
    this.create('departments', (table) => {
      table.string('dep_no').primary();
      table.string('dep_name',40).unique();
    })
  }

  down () {
    this.drop('departments')
  }
}

module.exports = DepartmentsSchema
