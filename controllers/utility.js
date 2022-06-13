const fs = require('fs');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgridApi);

const sessionModel = require('../models/sessions');
const User = require('../models/user');
const Package = require('../models/package');
const Property = require('../models/property');
const Order = require('../models/order');
const property = require('../models/property');

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

exports.sendSms = (msg, mobile) => {
  const fast2sms = stringify({
    authorization:
      'brk1v5yPoxAXBzTiwN8eaER4mHKVQqYlfCULSg02jZhOcFdtJWTOe2XR9DYwZiG8jMt47kK5VruamWFz',
    route: 'v3',
    sender_id: 'FTWSMS',
    message: msg,
    language: 'english',
    numbers: `${mobile}`,
    flash: '0',
  });
  const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2/?${fast2sms}`;
  console.log(fast2smsUrl);
  return fetch(fast2smsUrl).then((res) => res);
};

// Send OTP to User
exports.sendOtp = async (userId) => {
  const user = await User.findById(userId);
  user.otp = generateOTP();
  user.otpExpiry = Date.now() + 300000; //5 min Validity
  const result = await user.save();
  this.sendSms(
    `Hey! ${result.firstName} Your Otp: ${result.otp} only valid for 5 min`,
    result.mobile
  );
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

exports.isPackageValid = async (userId) => {
  // Get User Details
  const user = await User.findById(userId);
  if (user.isAdmin) return true;

  // Checking First Time User
  const order = await Order.findOne({ userId }).lean();
  if (!order && !user.packageId) {
    const package = await Package.findOne({
      name: 'free',
      type: 'membership',
      customerType: 'provider',
    }).lean();
    user.packageId = package._id;
    await user.save();
    return true;
  }

  // If Paid User
  const properties = await Property.find({ userId }).lean();
  const package = await Package.findById(user.packageId).lean();
  if (properties.length < package.propertyLimit) return true;

  return false;
};

exports.isPackageExpired = async (userId) => {
  // Get User Details
  const user = await User.findById(userId).lean();
  if (user.isAdmin) return false;
  if (!user.packageId) true;

  // Getting Order Details
  const lastOrder = await Order.findOne({
    packageId: user.packageId,
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();

  if (!lastOrder) return true;

  // Getting Package Details
  const package = await Package.findById(user.packageId).lean();

  if (package.validity - dateDifference(lastOrder.createdAt) <= 0) {
    const properties = await Property.find({ userId });
    properties.forEach(async (p) => {
      p.priority = 5;
      await p.save();
    });
    user.packageId = '';
    await user.save();
    return true;
  }

  return false;
};

const dateDifference = (startDate) => {
  // Calculating Date differences
  const date1 = new Date(startDate);
  const date2 = new Date();
  const Difference_In_Time = date2.getTime() - date1.getTime();
  return Math.floor(Difference_In_Time / (1000 * 3600 * 24));
};

exports.maskMobile = (mobile, packageId) => {
  if (!packageId) return `*******${mobile.slice(-3)}`;
  else return mobile;
};