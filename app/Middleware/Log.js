'use strict';
const Logger = use('Logger');
  


class Log {
  async handle ({ auth,response,request }, next) {
    // call next to advance the request
    var file = "Localhost"+request.url();
     Logger.transport('file')
      .info('request url is %s',file);
    await next();
  }
  
}

module.exports = Log;
