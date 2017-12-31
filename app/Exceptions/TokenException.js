'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class TokenException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    if (error.name === 'InvalidJwtToken') {
      response.status(500).send('Some message')
    }
  }

  // static invoke () {
  //   response.status(500).send('Some message')
  //   //return new this(message || 'The Jwt token is invalid', 401, 'E_INVALID_JWT_TOKEN')
  // }
}

module.exports = TokenException;
