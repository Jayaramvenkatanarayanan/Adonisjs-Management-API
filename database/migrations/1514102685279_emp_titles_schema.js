'use strict'

const Schema = use('Schema')

class EmpTitlesSchema extends Schema {
  up () {
    this.create('emp_titles', (table) => {
      // table.integer('emp_no');
      table.integer('emp_no').index().references('emp_no').inTable('employees').onDelete('CASCADE');
      table.string('title').notNullable();
      table.date('from_date').notNullable();
      table.date('to_date').notNullable();
      table.primary(['title','from_date']);
    })
  }

  down () {
    this.drop('emp_titles')
  }
}

module.exports = EmpTitlesSchema
