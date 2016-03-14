var nodemailer = require('nodemailer');
//var checkit = require('checkit');

var validateEmail = function ( email ) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test( email );
};

var transportOpts = {};

if ( process.argv.indexOf( "--develop" ) !== -1 ) {
  var MailDev = require('maildev');
  var maildev = new MailDev({ smtp: 1025 });
  maildev.listen();
  maildev.on( "new", function ( email ) {
    console.log( "email captured: http://localhost:1080" );
  });

  transportOpts = {
    port: 1025,
    ignoreTLS: true
  };
}

module.exports = function ( to, from, subject, body, cb ) {
  // cb function takes ( error, info )
  var transporter = nodemailer.createTransport( transportOpts );

  //checkit({email: ['required', 'email']}).run({})
  //    .then(function(){})

  return transporter.sendMail({
      from: from,
      bcc: Array.isArray( to ) ? to.join( "," ) : to,
      subject: subject,
      html: body
  }, cb );
};
