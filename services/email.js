var nodemailer = require('nodemailer');
//var checkit = require('checkit');

var transportOpts;

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
} else {
    transportOpts = process.env.EMAIL_CONFIG;
}

module.exports = function ( to, from, subject, body, cb ) {
  
  var transporter = nodemailer.createTransport( transportOpts );

  return transporter.sendMail({
      from: from,
      bcc: Array.isArray( to ) ? to.join( "," ) : to,
      subject: subject,
      html: body
  }, cb );
};
