'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route');

//LOGIN

Route.post('login','UserController.Userlogin');


// USER
Route.group(() => {

  Route.get('findall', 'UserController.Showall');
  Route.post('add', 'UserController.Store');
  Route.get('find/:id', 'UserController.Showid');
  Route.put('update/:id', 'UserController.Userupdate');
  Route.delete('remove/:id', 'UserController.Remove');
}).prefix('users').middleware('jwtCheck');

//Employee

Route.group(() => { 
   Route.post('add', 'EmployeeController.Store');
   Route.get('findall', 'EmployeeController.Showall');
   Route.get('find', 'EmployeeController.Showid');
   Route.put('update', 'EmployeeController.Empupdate');
   Route.delete('remove', 'EmployeeController.Remove');
   Route.get('salary','EmployeeController.empsal');
}).prefix('employee').middleware('jwtCheck');

//Emp-Salary

Route.group(() => {
  Route.get('find', 'EmpsalaryController.Showid');
  Route.put('update', 'EmpsalaryController.Salupdate');
}).prefix('salary');


