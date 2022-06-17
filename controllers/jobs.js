const User = require('../models/user');
const Property = require('../models/property');
const schedule = require('node-schedule');
const utility = require('./utility');

module.exports = () => {
  // Package Expiry Job
  schedule.scheduleJob('Package Expiry Job', `0 20 * * *`, async () => {
    const providers = await User.find(
      {
        typeOfUser: 'provider',
        packageId: { $exists: true },
      },
      { _id: true, firstName: true, lastName: true, mobile: true }
    ).lean();
    providers.forEach(async (p) => {
      const expired = await utility.isPackageExpired(p._id);
      if (expired)
        utility.sendSms(
          `Dear ${p.firstName},\nYour Package Got Expired\nPlease renew Your Package at\nrohinigirlspg.com/pricing`,
          p.mobile
        );
    });
  });

  // Property Priority
  schedule.scheduleJob('Property Priority', `0 * * * *`, async () => {
    const property = await Property.find(
      { isActive: true },
      { flexiPriority: true, priority: true }
    );
    const priority = property.map((p) => p.priority);
    const flexiPriority = utility.shuffle(priority);
    property.forEach(async (p, idx) => {
      p.flexiPriority = flexiPriority[idx];
      await p.save();
    });
  });
};
