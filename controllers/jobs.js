const User = require('../models/user');
const Property = require('../models/property');
const schedule = require('node-schedule');
const utility = require('./utility');

const getPropertyListingRange = (priority) => {
  switch (priority) {
    case 1: return [1, 2];
    case 2: return [1, 2];
    case 3: return [1, 2, 3];
    case 4: return [1, 2, 3, 4];
    case 5: return [1, 2, 3, 4, 5];
    default: return [5]
  }
}

module.exports = async () => {
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
          `Dear ${p.firstName},\nYour ${p}Package Got Expired\nPlease renew Your Package at\nrohinigirlspg.com/pricing`,
          p.mobile
        );
    });
  });

  // Property Priority
  schedule.scheduleJob('Property Priority', `30 */1 * * *`, async () => {
    const property = await Property.find(
      { isActive: true },
      { flexiPriority: true, priority: true }
    );

    // Geeting Priority Range
    const priority = property.map((p) => getPropertyListingRange(p.priority));

    // Shifting Priority
    priority.forEach(async (p, index) => {
      let flexiPriority = property[index].flexiPriority
      const idx = p.findIndex(i => i === flexiPriority)
      if (idx === -1) flexiPriority = p[0];
      flexiPriority = p[(idx + 1) % p.length]
      property[index].flexiPriority = flexiPriority
    })

    // Saving New Priority
    for (const p of property)
      await p.save();
  });
};


