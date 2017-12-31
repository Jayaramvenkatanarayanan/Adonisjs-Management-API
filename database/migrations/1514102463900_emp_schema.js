'use strict'

const Schema = use('Schema')

class EmpSchema extends Schema {
  up () {
    this.create('employees', table => {
      table.integer('emp_no').primary().notNullable().unique();
      table.string('firstname', 20).notNullable();
      table.string('lastname', 20);
      table.enu ('gender', ['m','f']).notNullable();
      table.date('hiredate').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('employees')
  }
}

module.exports = EmpSchema
