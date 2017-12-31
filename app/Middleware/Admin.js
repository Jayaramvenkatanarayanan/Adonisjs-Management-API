'use strict';
const User = use('App/Models/User');

class Admin {

  async handle({request, response, auth}, next) {

    try {
      await auth.check();
      await next();
    } catch (error) {
      return response.status(401).json(await User.ValidAuth);
    }
  }
}

module.exports = Admin;
