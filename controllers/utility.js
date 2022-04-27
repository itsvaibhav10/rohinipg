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
  const result = await user.save();

  const fast2sms = stringify({
    authorization:
      'NDnBsWtr5VEFAGoUT6xlzegIi9qkby0ZX7faj3Ov8SY2JQmu14rBvipAjykPVeq2UtbD7lfHoOSJQ4dR',
    route: 'v3',
    sender_id: 'Cghpet',
    message: `Hey! ${result.firstName} Your Otp: ${result.otp} only valid for 5 min`,
    language: 'english',
    numbers: result.mobile,
    flash: '0',
  });
  // Setup SMS Service Provider
  // const otpQuery = stringify({
  //   uname: 'itsvaibhav',
  //   password: '1qazxsw2@',
  //   sender: 'vmrohi',
  //   receiver: mobile,
  //   route: 'TA',
  //   msgtype: 1,
  //   sms: `Hey! ${name} Your Otp: ${otp} only valid for 5 min`,
  // });
  // const otpURL = `http://manage.staticking.net/index.php/smsapi/httpapi/?${otpQuery}`;
  // return console.log(otpURL);
  const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2/?${fast2sms}`;
  console.log(fast2smsUrl);
  return fetch(fast2smsUrl).then((res) => res);
};

/*   Delete Single File */
exports.deleteFile = (filepath = '') => {
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
    console.log(filepath);
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
exports.delSession = async (userId) => {
  await sessionModel.deleteMany({
    $and: [
      { 'session.user': { $exists: true } },
      { 'session.user._id': userId },
    ],
  });
};

exports.urltracker = (session = {}) => {
  return session && session.url ? session.url : '/';
};
