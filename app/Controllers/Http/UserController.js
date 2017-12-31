'use strict';

/**
 * Model and dependency and rules
 */
const dataBase = use('Database');
const User = use('App/Models/User');
const Validator = use('Validator');
const Event = use('Event');

//Message
const notFound = {data: "empty", message: 'Not Found', status: false};


class UserController {

  /**
   *
   * get all users
   */

  async Showall({auth, response}) {
    var user = await dataBase.table('users').count();
    var total = user[0]['count(*)'];
    if (total != 0) {
      var getAllUsers = await User.all();
      console.log(auth.user.email);
      return response.status(200).json({
        data: getAllUsers,
        message: 'get the record',
        status: true
      });
     
    }
    return response.status(404).json(notFound);
  }

  /**
   * Insert User
   */

  async Store({request, response}) {

    const userInput = request.only(['email', 'password']);
    const validation = await Validator.validate(userInput, User.NewUserAddRules, User.NewUserMessage);
    if (validation.fails()) {
      return response.status(400).json({
        data: validation._errorMessages[0].message,
        message: 'User registration fail',
        status: false
      });
    }
    var users = new User();
    users.email = userInput.email;
    users.password = userInput.password;
    await users.save();
    Event.fire('new::user', users);
    return response.status(201).json({
      message: "User save successful",
      status: true
    });
  }

  /**
   * Get by ID
   */

  async Showid({params, response}) {
    var userInfo = await User.find(params.id);
    if (userInfo != null) {
      return response.json({
        data: userInfo,
        message: 'get the record',
        status: true
      });
    }
    return response.status(404).json(notFound);
  }

  /**
   * delete
   */

  async Remove({params, response}) {
    var checkUser = await User.find(params.id);
    if (!checkUser) {
      return response.status(404).json({
        data: 'no data found',
        message: 'Id does not match /  no records found',
        status: false
      })
    }
    await checkUser.delete();
    return response.status(204).json({data: checkUser, message: 'delete successfully', status: true})
  }

  /**
   * Update
   */

  async Userupdate({params, request, response}) {
    var checkUser = await User.find(params.id);
    if (!checkUser) {
      return response.status(404).json({
        data: 'update fail',
        message: 'Id does not match',
        status: false
      })
    }

    const userInput = request.only(['email', 'password']);
    const validation = await Validator.validate(userInput, User.NewUserAddRules, User.NewUserMessage);
    if (validation.fails()) {
      return response.status(400).json({
        data: validation._errorMessages[0].message,
        message: 'User registration fail',
        status: false
      });
    }
    checkUser.password = userInput.password;
    checkUser.email = userInput.email;
    await checkUser.save();
    return response.status(200).json({
      message: 'user Update successfull',
      status: true
    });
  }


  /**
   * Login
   */

  async Userlogin({auth, request, response}) {
    let {email, password} = request.all();
    var token = await auth.attempt(email, password);
    if (!token) {
      return response.status(401).json({
        data: token,
        message: 'Login failed',
        status: false
      });
    }
    return response.status(200).json({
      data: token,
      message: 'Login successfully',
      status: true
    });
  }
}


module.exports = UserController;
