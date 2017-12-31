'use strict';

const Model = use('Model');

const Logger = use('Logger');

class User extends Model {
    
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     *
     * Look at `app/Models/Hooks/User.js` file to
     * check the hashPassword method
     */
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  // Password Hidden

  static get hidden() {
    return ['password'];
  }

  /**
   * create for new user rules before save validation
   *
   * @readonly
   * @static
   * @memberof User
   */
  static get NewUserAddRules() {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  /**
   * validation method for resending messages
   *
   * @method UserRules
   *
   * @return {Object}
   */

  static get NewUserMessage() {
    return {
      'email.required': 'Enter email address to be used for login',
      'email.email': 'Email address not valied',
      'email.max': 'Email address not more than 50 character',
      'email.unique': 'There\'s already an account with this email address',
      'password.required': 'password required'
    }
  }
  
  static get ValidAuth(){
    return{
       status :false,
       message:"Required token",
       data:"JWT token need in header "
    }
  }
  

}
module.exports = User;
