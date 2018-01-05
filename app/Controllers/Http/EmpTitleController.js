'use strict';

const dataBase = use('Database');
const EmpTitle = use('App/Models/EmpTitle');
const Employee = use('App/Models/Employee');
const Validator = use('Validator');

//Message
const notFound = {data: "empty", message: 'Not Found', status: false};

class EmpTitleController {

    //get by emp_no

    async Showtitle({request,response}) {
    const outPut = {}
    var {emp_no} = request.only('emp_no');
    var employee = await EmpTitle.findBy('emp_no', emp_no);
    if (employee) {
      var user = await Employee.findBy('emp_no', emp_no);
      const empSalary = await user.emp_titles().fetch()
      outPut.emp_titles = employee
      outPut.emp_details = user
      return response.status(200).json({
          data: outPut,
          message: 'get the record',
          status: true
      });
    }

    return response.status(404).json(notFound);
  }


// Update the EmpTitle

async TitleUpdate({request,response}){
  const empInput = request.only(['emp_no',"title","from_date","to_date"]);
  const empCheck = await EmpTitle.findBy('emp_no', emp_no);
  console.log(empCheck);
  if(!empCheck){
      return response.status(404).json(notFound);
  }
  const inputValidation = Validator.validator(empInput,EmpTitle.TitleUpdate,EmpTitle.UpdateMessage)
  if(inputValidation.fails()){
    return response.status(400).json({
        data: inputValidation._errorMessages[0].message,
        message: 'Employee registration fail',
        status: false
    });
  }
  await dataBase.table('emp_titles').where('emp_no', empInput.emp_no).update({'title': empInput.salary}, {'to_date': empInput.to_date});
  return response.status(200).json({
      message: 'emp salary Update successfull',
      status: true
  });
}

}

module.exports = EmpTitleController
