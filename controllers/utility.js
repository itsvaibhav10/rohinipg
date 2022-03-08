const fs = require('fs');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgridApi);

const sessionModel = require('../models/sessions');
const User = require('../models/user');

// Generate OTP
const generateOTP = () => {
  let digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Send Mail To USer
exports.sendMail = (from, to, subject, content) => {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: content,
  };
  sgMail.send(msg);
  console.log('email Send');
};

// Send OTP to User
exports.sendOtp = async (userId) => {
  const user = await User.findById(userId);
  user.otp = generateOTP();
  user.otpExpiry = Date.now() + 300000; //5 min Validity
  await user.save();
  return;

  // Setup SMS Service Provider
  const otpQuery = stringify({
    uname: 'itsvaibhav',
    password: '1qazxsw2@',
    sender: 'vmrohi',
    receiver: mobile,
    route: 'TA',
    msgtype: 1,
    sms: `Hey! ${name} Your Otp: ${otp} only valid for 5 min`,
  });
  const otpURL = `http://manage.staticking.net/index.php/smsapi/httpapi/?${otpQuery}`;
  return console.log(otpURL);
  // return fetch(otpURL).then((res) => res);
};

/*   Delete Single File */
exports.deleteFile = (filepath = '') => {
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
  });
};

/* Delete Array of Files */
exports.deleteFiles = (filesPathArray = []) => {
  for (const filePath of filesPathArray) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

/* Delete Previous Session */
exports.delSession = async (email) => {
  await sessionModel.deleteMany({
    $and: [
      { 'session.user': { $exists: true } },
      { 'session.user.email': email },
    ],
  });
};
