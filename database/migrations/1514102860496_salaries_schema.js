'use strict'

const Schema = use('Schema')

class SalariesSchema extends Schema {
  up () {
    this.create('salaries', (table) => {
      table.integer('emp_no').index().references('emp_no').inTable('employees').onDelete('CASCADE');
      table.integer('salary').notNullable();
      table.date('from_date').notNullable();
      table.date('to_date').notNullable();
      table.primary(['emp_no','from_date']);
    })
  }

  down () {
    this.drop('salaries')
  }
}

module.exports = SalariesSchema
