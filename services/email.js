var nodemailer = require('nodemailer');
var validateEmail = function ( email ) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test( email );
};

module.exports = function ( to, from, subject, body, cb ) {
  // cb function takes ( error, info )
  var transporter = nodemailer.createTransport({port:25});
  //var transporter = nodemailer.createTransport({
  //  service: 'gmail',
  //  auth: {
  //      user: '***',
  //      pass: '***'
  //  }
  //});

  return transporter.sendMail({
      from: from,
      bcc: Array.isArray( to ) ? to.join( "," ) : to,
      subject: subject,
      html: body
  }, cb );
};