'use strict'

const Schema = use('Schema')

class EmpDeptsSchema extends Schema {
  up () {
    this.create('emp_depts', (table) => {
     // table.integer('emp_no');
      table.integer('emp_no').index().references('emp_no').inTable('employees').onDelete('CASCADE');
      table.string('dep_no').index().references('dep_no').inTable('departments').onDelete('CASCADE');
      table.date('from_date').notNullable();
      table.date('to_date').notNullable();
    })
  }

  down () {
    this.drop('emp_depts')
  }
}

module.exports = EmpDeptsSchema
