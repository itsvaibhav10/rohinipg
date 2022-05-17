const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // Required Main
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    priority: { type: String, default: '5', required: true },
    password: { type: String, required: true },
    doj: { type: Date, required: true, default: Date.now() },
    customerType: { type: String, default: 'free' },
    emailVerify: { type: Boolean, required: true, default: false },
    mobileVerify: { type: Boolean, required: true, default: false },
    typeOfUser: { type: String, default: 'tenant' },
    subscriptionType: { type: String, required: true, default: 'free' },
    wishlist: { type: Array },
    counter: { type: Number, default: 0 },
    limit: { type: Number, default: 0 },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    activationToken: String,
    otp: String,
    otpExpiry: String,
    resetToken: String,
    resetTokenExpiration: Date,
    profileImg: String,
    googleId: String,
    notification: {
      title: String,
      description: String,
      link: String,
      activeDate: Date,
      expiry: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
