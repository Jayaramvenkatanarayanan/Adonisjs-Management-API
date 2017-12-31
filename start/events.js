// event while using inserting user
//event
const Event = use('Event');
const Logger = use('Logger');

//mail
const Mail = use('Mail');

Event.on('new::user', async (users) => {
  await Mail
    .connection('smtp')
    .send('emails.welcome', users.toJSON(), (message) => {
      message
        .to(users.email)
        .from('vjayaram01@gmail.com')
        .subject('Management APP')
    });
  Logger.transport('file')
    .info('mail send to'+' '+'users.email',file);
});
