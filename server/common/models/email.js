'use strict';

module.exports = function(Email) {

  /**
 * send email
 * @param {string} to email to
 * @param {string} from email from
 * @param {string} subject email subject
 * @param {string} text email text
 * @param {string} html email html
 * @param {Function(Error, object)} callback
 */

Email.prototype.sendemail = function(to, from, subject, text, html, callback) {
  var result;
  var nodemailer = require('nodemailer');
  var res;
  var to,from,subject,text,html;
  Email.find(function(err, emails) {

    to = emails[0].to;
    from = emails[0].from;
    subject = emails[0].subject;
    text = emails[0].text;
    html = emails[0].html;
  });
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'birukjr52@gmail.com',
          pass: 'birukjry'
      }
  });
  const mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html // html body
  };
  transporter.sendMail(mailOptions, function (err, info) {
      if (err)
          console.log(err)
      else
          Email.destroyAll(function(msg) {
              console.log(msg);
          });
          console.log(info);
  });
  callback(null, result);
};

};
