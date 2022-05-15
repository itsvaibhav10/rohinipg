// ---------------   Models  ---------------
const User = require('../../models/user');

// ---------------   Global Functions  ---------------
const { sendOtp } = require('../utility');

// ---------------   Verify User Mobile OTP  ---------------
exports.getVerifyUser = async (req, res) => {
  const user = await User.findById(req.params.token).lean();
  if (!user || !user.otp) return res.redirect('/home');
  res.render('auth/verify', {
    path: 'otpVerify',
    pageTitle: 'OTP Verification',
    errorMessage: '',
    userId: user._id,
    mobile: user.mobile.slice(-4),
    otp: user.otp,
  });
};

exports.postVerifyUser = async (req, res) => {
  const otp = req.body.otp;
  const userId = req.body.userId;
  const user = await User.findOne({ _id: userId, otp: otp });

  if (!user) return res.send({ errorMessage: 'Invalid OTP' });
  else if (user.otpExpiry < Date.now())
    return res.send({ errorMessage: 'OTP Expired' });
  else {
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.mobileVerify = true;
    await user.save();
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save((err) => {
      const url = req.session && req.session.url ? req.session.url : '/home';
      return res.send({ url: url });
    });
  }
};

exports.resendOtp = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.redirect('/home');
  sendOtp(userId);
  res.send({ send: true });
};
