// ---------------   Models  ---------------
const User = require('../../models/user');

// ---------------   Global Functions  ---------------
const { sendOtp } = require('../utility');

// ---------------   Verify User Mobile OTP  ---------------
exports.getVerifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.token).lean();
    if (!user || !user.otp) return res.redirect('/home');
    res.render('auth/verify', {
      path: 'otpVerify',
      pageTitle: 'OTP Verification',
      errorMessage: '',
      userId: user._id,
      mobile: user.mobile.slice(-4),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.postVerifyUser = async (req, res, next) => {
  try {
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
      return res.send({ url: '/login' });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.redirect('/home');
    sendOtp(userId);
    res.send({ send: true });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
