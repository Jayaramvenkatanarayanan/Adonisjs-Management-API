'use strict'

const Schema = use('Schema')

class DepManagersSchema extends Schema {
  up () {
    this.create('dep_managers', (table) => {
      table.increments().primary().unsigned();
      table.integer('emp_no').index().references('emp_no').inTable('employees').onDelete('CASCADE');
      table.string('dep_no').index().references('dep_no').inTable('departments').onDelete('CASCADE');
      table.date('from_date').notNullable();
      table.date('to_date').notNullable();
    })
  }

  down () {
    this.drop('dep_managers')
  }
}

module.exports = DepManagersSchema
